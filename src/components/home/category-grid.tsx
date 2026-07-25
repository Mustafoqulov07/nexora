import Link from "next/link";
import {
  UserCircle2,
  Coins,
  TrendingUp,
  Package,
  Wallet,
  KeyRound,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES } from "@/lib/mock-data";
import { formatCompactNumber } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  UserCircle2,
  Coins,
  TrendingUp,
  Package,
  Wallet,
  KeyRound,
};

export function CategoryGrid() {
  return (
    <section className="container py-16 sm:py-20">
      <div className="mb-9 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Категории</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Найдите то, что нужно именно для вашей игры
          </p>
        </div>
        <Link
          href="/categories"
          className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
        >
          Все категории
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((category) => {
          const Icon = ICONS[category.iconName] ?? Package;
          return (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="glass glass-hover group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl px-4 py-7 text-center"
            >
              <div
                className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-20 blur-xl transition-opacity group-hover:opacity-40"
                style={{
                  background: `linear-gradient(135deg, ${category.accentFrom}, ${category.accentTo})`,
                }}
              />
              <div
                className="relative flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  background: `linear-gradient(135deg, ${category.accentFrom}22, ${category.accentTo}22)`,
                }}
              >
                <Icon className="h-6 w-6" style={{ color: category.accentFrom }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{category.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatCompactNumber(category.productsCount)} товаров
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
