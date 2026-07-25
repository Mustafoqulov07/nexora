import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrdersTabs } from "@/components/orders/orders-tabs";
import type { OrderCardData } from "@/components/orders/order-card";

export const metadata = { title: "Мои заказы" };

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/login?callbackUrl=/orders");

  const [purchases, sales] = await Promise.all([
    prisma.order.findMany({
      where: { buyerId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { product: { include: { images: { take: 1, orderBy: { order: "asc" } } } }, seller: true },
    }),
    prisma.order.findMany({
      where: { sellerId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { product: { include: { images: { take: 1, orderBy: { order: "asc" } } } }, buyer: true },
    }),
  ]);

  const purchaseCards: OrderCardData[] = purchases.map((o) => ({
    id: o.id,
    status: o.status,
    totalPrice: Number(o.totalPrice),
    createdAt: o.createdAt.toISOString(),
    role: "buyer",
    product: { title: o.product.title, imageUrl: o.product.images[0]?.url ?? "/placeholder-product.png", slug: o.product.slug },
    counterpartyName: o.seller.name ?? "Продавец",
  }));

  const salesCards: OrderCardData[] = sales.map((o) => ({
    id: o.id,
    status: o.status,
    totalPrice: Number(o.totalPrice),
    createdAt: o.createdAt.toISOString(),
    role: "seller",
    product: { title: o.product.title, imageUrl: o.product.images[0]?.url ?? "/placeholder-product.png", slug: o.product.slug },
    counterpartyName: o.buyer.name ?? "Покупатель",
  }));

  return (
    <div className="container py-10">
      <h1 className="font-display text-2xl font-bold sm:text-3xl">Мои заказы</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Отслеживайте статус покупок и продаж — от оплаты до завершения сделки
      </p>

      <div className="mt-8">
        <OrdersTabs purchases={purchaseCards} sales={salesCards} />
      </div>
    </div>
  );
}
