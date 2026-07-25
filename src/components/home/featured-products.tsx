"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/shared/product-card";
import { PRODUCTS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "hit", label: "Хиты продаж" },
  { key: "new", label: "Новинки" },
  { key: "sale", label: "Скидки" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<TabKey>("hit");

  const filtered = useMemo(
    () => PRODUCTS.filter((p) => p.badges.includes(activeTab)),
    [activeTab]
  );

  return (
    <section className="container py-16 sm:py-20">
      <div className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Рекомендуем сегодня
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Подборка проверенных товаров с лучшим соотношением цены и качества
          </p>
        </div>

        <div className="glass inline-flex w-fit gap-1 rounded-xl p-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                activeTab === tab.key
                  ? "bg-gradient-brand text-white shadow-md shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
            В этой подборке пока нет товаров — загляните позже.
          </p>
        )}
      </div>

      <div className="mt-9 flex justify-center">
        <Link
          href="/catalog"
          className="glass glass-hover inline-flex items-center gap-1.5 rounded-xl px-5 py-3 text-sm font-semibold"
        >
          Смотреть весь каталог
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
