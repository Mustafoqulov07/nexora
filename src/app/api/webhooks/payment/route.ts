import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature } from "@/lib/payment/provider";

interface PaymentWebhookPayload {
  event: "payment.succeeded" | "payment.canceled";
  object: {
    metadata: { orderId: string };
  };
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-webhook-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Недействительная подпись" }, { status: 401 });
  }

  let payload: PaymentWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Некорректный JSON" }, { status: 400 });
  }

  const orderId = payload.object?.metadata?.orderId;
  if (!orderId) {
    return NextResponse.json({ error: "orderId отсутствует в metadata" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
  }

  // Идемпотентность: повторный вызов webhook не должен задваивать эффект.
  if (order.status !== "PENDING_PAYMENT") {
    return NextResponse.json({ ok: true, note: "Уже обработано" });
  }

  if (payload.event === "payment.succeeded") {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID_IN_ESCROW" },
      }),
      prisma.notification.create({
        data: {
          userId: order.sellerId,
          type: "ORDER_UPDATE",
          title: "Новый оплаченный заказ",
          message: `Заказ #${order.id} оплачен и ожидает передачи товара покупателю.`,
        },
      }),
    ]);
  } else if (payload.event === "payment.canceled") {
    await prisma.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } });
  }

  return NextResponse.json({ ok: true });
}
