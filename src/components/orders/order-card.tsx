"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { PackageCheck, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { formatPrice } from "@/lib/utils";
import {
  confirmReceipt,
  markOrderDelivered,
  openDispute,
} from "@/lib/actions/order-actions";

export interface OrderCardData {
  id: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  role: "buyer" | "seller";
  product: { title: string; imageUrl: string; slug: string };
  counterpartyName: string;
}

export function OrderCard({ order }: { order: OrderCardData }) {
  const [isPending, startTransition] = useTransition();
  const [deliveryPayload, setDeliveryPayload] = useState("");
  const [disputeReason, setDisputeReason] = useState("");
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [showDisputeForm, setShowDisputeForm] = useState(false);

  function handleConfirmReceipt() {
    startTransition(async () => {
      const result = await confirmReceipt({ orderId: order.id });
      if (result.success) {
        toast.success("Получение подтверждено, средства переведены продавцу");
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleMarkDelivered() {
    if (deliveryPayload.trim().length === 0) {
      toast.error("Укажите данные для передачи покупателю");
      return;
    }
    startTransition(async () => {
      const result = await markOrderDelivered({ orderId: order.id, deliveryPayload });
      if (result.success) {
        toast.success("Товар отмечен как переданный");
        setShowDeliveryForm(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleOpenDispute() {
    if (disputeReason.trim().length < 10) {
      toast.error("Опишите проблему подробнее (не менее 10 символов)");
      return;
    }
    startTransition(async () => {
      const result = await openDispute({ orderId: order.id, reason: disputeReason });
      if (result.success) {
        toast.success("Спор открыт, поддержка подключится в ближайшее время");
        setShowDisputeForm(false);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="glass flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center">
      <Link href={`/product/${order.product.slug}`} className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl">
        <Image src={order.product.imageUrl} alt={order.product.title} fill className="object-cover" />
      </Link>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <span className="font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</span>
        </div>
        <h3 className="mt-1.5 font-display text-sm font-semibold leading-snug">
          {order.product.title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          {order.role === "buyer" ? "Продавец" : "Покупатель"}: {order.counterpartyName}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <span className="font-mono text-lg font-bold">{formatPrice(order.totalPrice)}</span>

        {order.role === "seller" && order.status === "PAID_IN_ESCROW" && !showDeliveryForm && (
          <Button size="sm" variant="brand" onClick={() => setShowDeliveryForm(true)}>
            <PackageCheck /> Передать товар
          </Button>
        )}

        {order.role === "buyer" && order.status === "DELIVERED" && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => setShowDisputeForm((v) => !v)}>
              <ShieldAlert /> Спор
            </Button>
            <Button size="sm" variant="brand" onClick={handleConfirmReceipt} disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" /> : <PackageCheck />}
              Подтвердить получение
            </Button>
          </div>
        )}
      </div>

      {showDeliveryForm && (
        <div className="w-full space-y-2 border-t border-white/10 pt-4 sm:col-span-full">
          <label className="text-xs font-medium text-muted-foreground">
            Данные для покупателя (логин/пароль, ключ, инструкция)
          </label>
          <textarea
            value={deliveryPayload}
            onChange={(e) => setDeliveryPayload(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm outline-none focus:border-primary/50"
            placeholder="Например: login: xxx / password: xxx"
          />
          <Button size="sm" variant="brand" onClick={handleMarkDelivered} disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : <PackageCheck />}
            Подтвердить передачу
          </Button>
        </div>
      )}

      {showDisputeForm && (
        <div className="w-full space-y-2 border-t border-white/10 pt-4 sm:col-span-full">
          <label className="text-xs font-medium text-muted-foreground">Причина спора</label>
          <textarea
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm outline-none focus:border-destructive/50"
            placeholder="Опишите, что не так с товаром"
          />
          <Button size="sm" variant="destructive" onClick={handleOpenDispute} disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" /> : <ShieldAlert />}
            Открыть спор
          </Button>
        </div>
      )}
    </div>
  );
}
