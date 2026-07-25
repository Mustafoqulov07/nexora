interface CreateSessionParams {
  orderId: string;
  amount: number;
  description: string;
}

/**
 * Creates a hosted payment-page session with the payment provider and
 * returns the URL the buyer should be redirected to.
 *
 * This is an integration boundary: swap the body for the real SDK
 * (YooKassa / CloudPayments / Robokassa / Stripe) without touching
 * any of the order-actions logic that calls it.
 */
export async function createPaymentSession(params: CreateSessionParams): Promise<string> {
  const providerUrl = process.env.PAYMENT_PROVIDER_URL;
  const shopId = process.env.PAYMENT_SHOP_ID;
  const secretKey = process.env.PAYMENT_SECRET_KEY;

  if (!providerUrl || !shopId || !secretKey) {
    throw new Error(
      "Платёжный провайдер не настроен: заполните PAYMENT_PROVIDER_URL, PAYMENT_SHOP_ID, PAYMENT_SECRET_KEY в .env"
    );
  }

  const response = await fetch(`${providerUrl}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${shopId}:${secretKey}`).toString("base64")}`,
      "Idempotence-Key": params.orderId,
    },
    body: JSON.stringify({
      amount: { value: params.amount.toFixed(2), currency: "RUB" },
      description: params.description,
      confirmation: {
        type: "redirect",
        return_url: `${process.env.AUTH_URL}/orders/${params.orderId}`,
      },
      metadata: { orderId: params.orderId },
    }),
  });

  if (!response.ok) {
    throw new Error("Не удалось создать сессию оплаты");
  }

  const data = (await response.json()) as { confirmation: { confirmation_url: string } };
  return data.confirmation.confirmation_url;
}

/**
 * Verifies that an incoming webhook payload genuinely came from the
 * payment provider (HMAC signature check). Replace with the provider's
 * documented verification method.
 */
export function verifyWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  if (!signatureHeader) return false;
  const crypto = require("node:crypto") as typeof import("node:crypto");
  const expected = crypto
    .createHmac("sha256", process.env.PAYMENT_SECRET_KEY ?? "")
    .update(rawBody)
    .digest("hex");
  const expectedBuf = Buffer.from(expected);
  const receivedBuf = Buffer.from(signatureHeader);
  if (expectedBuf.length !== receivedBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}
