"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPaymentSession } from "@/lib/payment/provider";
import {
  createOrderSchema,
  markDeliveredSchema,
  confirmReceiptSchema,
  openDisputeSchema,
  resolveDisputeSchema,
} from "@/lib/validations/order";

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Шаг 1: покупатель инициирует заказ.
 * Заказ создаётся в статусе PENDING_PAYMENT, деньги ещё не списаны.
 * Возвращает ссылку на оплату у платёжного провайдера.
 */
export async function createOrder(
  input: unknown
): Promise<ActionResult<{ orderId: string; paymentUrl: string }>> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Войдите в аккаунт, чтобы оформить заказ" };

  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Некорректные данные заказа" };

  const product = await prisma.product.findUnique({
    where: { id: parsed.data.productId },
    select: { id: true, price: true, stockCount: true, status: true, sellerId: true },
  });

  if (!product || product.status !== "ACTIVE") {
    return { success: false, error: "Товар недоступен для покупки" };
  }
  if (product.stockCount < 1) {
    return { success: false, error: "Товар закончился" };
  }
  if (product.sellerId === session.user.id) {
    return { success: false, error: "Нельзя купить собственный товар" };
  }

  const order = await prisma.order.create({
    data: {
      productId: product.id,
      buyerId: session.user.id,
      sellerId: product.sellerId,
      totalPrice: product.price,
      status: "PENDING_PAYMENT",
    },
  });

  const paymentUrl = await createPaymentSession({
    orderId: order.id,
    amount: Number(product.price),
    description: `Заказ NEXORA #${order.id}`,
  });

  return { success: true, data: { orderId: order.id, paymentUrl } };
}

/**
 * Шаг 3: продавец передаёт товар покупателю.
 * Разрешено только когда деньги уже находятся в эскроу (PAID_IN_ESCROW).
 */
export async function markOrderDelivered(input: unknown): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Требуется авторизация" };

  const parsed = markDeliveredSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Некорректные данные" };
  }

  const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } });
  if (!order) return { success: false, error: "Заказ не найден" };
  if (order.sellerId !== session.user.id) {
    return { success: false, error: "Только продавец может передать товар" };
  }
  if (order.status !== "PAID_IN_ESCROW") {
    return { success: false, error: "Заказ должен быть оплачен, прежде чем передавать товар" };
  }

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { status: "DELIVERED", deliveryPayload: parsed.data.deliveryPayload },
    }),
    prisma.notification.create({
      data: {
        userId: order.buyerId,
        type: "ORDER_UPDATE",
        title: "Товар передан",
        message: "Продавец передал товар. Проверьте и подтвердите получение в разделе «Мои заказы».",
      },
    }),
  ]);

  revalidatePath("/orders");
  return { success: true, data: undefined };
}

/**
 * Шаг 4: покупатель подтверждает получение — только теперь деньги
 * уходят продавцу. Все изменения атомарны (prisma.$transaction).
 */
export async function confirmReceipt(input: unknown): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Требуется авторизация" };

  const parsed = confirmReceiptSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Некорректные данные" };

  const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } });
  if (!order) return { success: false, error: "Заказ не найден" };
  if (order.buyerId !== session.user.id) {
    return { success: false, error: "Только покупатель может подтвердить получение" };
  }
  if (order.status !== "DELIVERED") {
    return { success: false, error: "Заказ ещё не передан продавцом" };
  }

  await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: { status: "COMPLETED", completedAt: new Date() },
    });

    await tx.user.update({
      where: { id: order.sellerId },
      data: { balance: { increment: order.totalPrice } },
    });

    await tx.product.update({
      where: { id: order.productId },
      data: { salesCount: { increment: 1 }, stockCount: { decrement: 1 } },
    });

    await tx.sellerProfile.updateMany({
      where: { userId: order.sellerId },
      data: { salesCount: { increment: 1 } },
    });

    await tx.notification.create({
      data: {
        userId: order.sellerId,
        type: "ORDER_UPDATE",
        title: "Оплата поступила",
        message: `Покупатель подтвердил получение заказа #${order.id}. Средства зачислены на баланс.`,
      },
    });
  });

  revalidatePath("/orders");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}

/**
 * Покупатель открывает спор, если товар не соответствует описанию.
 */
export async function openDispute(input: unknown): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Требуется авторизация" };

  const parsed = openDisputeSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Некорректные данные" };
  }

  const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } });
  if (!order) return { success: false, error: "Заказ не найден" };
  if (order.buyerId !== session.user.id) {
    return { success: false, error: "Только покупатель может открыть спор" };
  }
  if (order.status !== "DELIVERED") {
    return { success: false, error: "Спор можно открыть только после передачи товара" };
  }

  await prisma.order.update({ where: { id: order.id }, data: { status: "DISPUTED" } });

  revalidatePath("/orders");
  return { success: true, data: undefined };
}

/**
 * Только администратор: разрешает спор — либо доплачивает продавцу,
 * либо возвращает деньги покупателю.
 */
export async function resolveDispute(input: unknown): Promise<ActionResult> {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Недостаточно прав" };
  }

  const parsed = resolveDisputeSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "Некорректные данные" };

  const order = await prisma.order.findUnique({ where: { id: parsed.data.orderId } });
  if (!order || order.status !== "DISPUTED") {
    return { success: false, error: "Заказ не находится в статусе спора" };
  }

  if (parsed.data.resolution === "COMPLETE") {
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { status: "COMPLETED", completedAt: new Date() },
      }),
      prisma.user.update({
        where: { id: order.sellerId },
        data: { balance: { increment: order.totalPrice } },
      }),
    ]);
  } else {
    await prisma.order.update({ where: { id: order.id }, data: { status: "REFUNDED" } });
    // В проде: инициировать возврат средств через API платёжного провайдера.
  }

  revalidatePath("/admin/disputes");
  return { success: true, data: undefined };
}
