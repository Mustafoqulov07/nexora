import { CircleDot, ArrowRight } from "lucide-react";
import { LIVE_DEALS } from "@/lib/mock-data";
import { pluralizeRu } from "@/lib/utils";

export function LiveTicker() {
  const items = [...LIVE_DEALS, ...LIVE_DEALS];

  return (
    <div className="border-y border-white/[0.06] bg-surface/30">
      <div className="flex items-center">
        <div className="container flex items-center gap-3 py-3">
          <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-destructive/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-destructive">
            <CircleDot className="h-3 w-3 animate-glow-pulse" />
            Сейчас
          </span>
        </div>
      </div>

      <div className="relative overflow-hidden pb-3">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

        <div className="flex w-max animate-marquee gap-3 [animation-play-state:running] hover:[animation-play-state:paused]">
          {items.map((deal, i) => (
            <div
              key={`${deal.buyer}-${i}`}
              className="glass flex shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs"
            >
              <span className="font-semibold text-foreground">{deal.buyer}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground" />
              <span className="text-muted-foreground">{deal.product}</span>
              <span className="font-mono font-semibold text-accent">{deal.price}</span>
              <span className="text-muted-foreground">
                · {deal.minutesAgo}{" "}
                {pluralizeRu(deal.minutesAgo, ["минуту", "минуты", "минут"])} назад
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
