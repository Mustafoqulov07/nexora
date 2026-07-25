import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-surface text-foreground",
        brand: "border-transparent bg-gradient-brand text-white",
        success: "border-success/30 bg-success/15 text-success",
        warning: "border-amber-400/30 bg-amber-400/15 text-amber-300",
        danger: "border-destructive/30 bg-destructive/15 text-destructive",
        accent: "border-accent/30 bg-accent/15 text-accent",
        outline: "border-white/15 bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
