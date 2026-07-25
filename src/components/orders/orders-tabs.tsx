"use client";

import { useState } from "react";
import { PackageOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderCard, type OrderCardData } from "@/components/orders/order-card";

export function OrdersTabs({
  purchases,
  sales,
}: {
  purchases: OrderCardData[];
  sales: OrderCardData[];
}) {
  const [tab, setTab] = useState<"purchases" | "sales">("purchases");
  const activeList = tab === "purchases" ? purchases : sales;

  return (
    <div>
      <div className="glass inline-flex gap-1 rounded-xl p-1">
        <button
          onClick={() => setTab("purchases")}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            tab === "purchases"
              ? "bg-gradient-brand text-white shadow-md shadow-primary/25"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Покупки ({purchases.length})
        </button>
        <button
          onClick={() => setTab("sales")}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            tab === "sales"
              ? "bg-gradient-brand text-white shadow-md shadow-primary/25"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Продажи ({sales.length})
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {activeList.length === 0 && (
          <div className="glass flex flex-col items-center gap-3 rounded-2xl py-16 text-center">
            <PackageOpen className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {tab === "purchases" ? "У вас пока нет покупок" : "У вас пока нет продаж"}
            </p>
          </div>
        )}
        {activeList.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
