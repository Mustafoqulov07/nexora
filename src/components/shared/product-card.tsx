"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Star, ShieldCheck, Flame, Sparkles, Tag, Gem } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatPrice, pluralizeRu } from "@/lib/utils";
import type { Product, ProductBadge } from "@/types/product";

const BADGE_CONFIG: Record<ProductBadge, { label: string; icon: React.ElementType; variant: "brand" | "success" | "danger" | "accent" }> = {
  hit: { label: "Хит продаж", icon: Flame, variant: "brand" },
  new: { label: "Новинка", icon: Sparkles, variant: "accent" },
  sale: { label: "Скидка", icon: Tag, variant: "danger" },
  exclusive: { label: "Эксклюзив", icon: Gem, variant: "success" },
};

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const discount = product.oldPrice
    ? Math.round(100 - (product.price / product.oldPrice) * 100)
    : null;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "group glass glass-hover relative flex flex-col overflow-hidden rounded-2xl",
        !product.inStock && "opacity-60",
        className
      )}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />

          {product.badges.length > 0 && (
            <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
              {product.badges.map((badgeKey) => {
                const cfg = BADGE_CONFIG[badgeKey];
                const Icon = cfg.icon;
                return (
                  <Badge key={badgeKey} variant={cfg.variant} className="shadow-md">
                    <Icon className="h-3 w-3" />
                    {cfg.label}
                  </Badge>
                );
              })}
            </div>
          )}

          {discount && (
            <div className="absolute right-2.5 top-2.5 rounded-lg bg-destructive px-2 py-1 text-xs font-bold text-white shadow-md">
              −{discount}%
            </div>
          )}

          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Badge variant="outline">Нет в наличии</Badge>
            </div>
          )}
        </div>
      </Link>

      <button
        type="button"
        aria-label="Добавить в избранное"
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/60"
        style={{ top: product.badges.length > 0 || discount ? "3.25rem" : "0.75rem" }}
      >
        <Heart className="h-4 w-4" />
      </button>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <span className="text-xs font-medium text-accent">{product.categoryName}</span>

        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
          <span>
            ({product.reviewsCount} {pluralizeRu(product.reviewsCount, ["отзыв", "отзыва", "отзывов"])})
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          {product.seller.isVerified && <ShieldCheck className="h-3.5 w-3.5 text-success" />}
          <span className="truncate">{product.seller.name}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-col">
            {product.oldPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
            <span className="font-mono text-lg font-bold text-foreground">
              {formatPrice(product.price)}
            </span>
          </div>
          <Button size="sm" variant="brand" disabled={!product.inStock}>
            Купить
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
