"use client";

import { Gem, Radio } from "lucide-react";
import { formatRs, maskPlayerId, timeAgo } from "@/lib/format";

export interface TickerEntry {
  playerId: string;
  diamonds: number;
  price: string;
  createdAt: string;
}

export default function LiveTicker({ entries }: { entries: TickerEntry[] }) {
  if (entries.length === 0) return null;
  const loop = [...entries, ...entries];

  return (
    <div className="border-b border-line bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <span className="flex shrink-0 items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.14em] text-brand-700 ring-1 ring-brand-200">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-500 opacity-70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-500" />
          </span>
          Live
        </span>
        <div className="ticker-mask overflow-hidden">
          <div className="flex w-max animate-marquee items-center gap-8">
            {loop.map((e, i) => (
              <span
                key={`${e.playerId}-${i}`}
                className="flex items-center gap-2 whitespace-nowrap text-[12.5px] text-ink-soft"
              >
                <Gem className="h-3.5 w-3.5 shrink-0 text-brand-500" />
                <span className="font-semibold text-ink">{maskPlayerId(e.playerId)}</span>
                <span>topped up</span>
                <span className="font-display font-bold text-brand-700">
                  {e.diamonds.toLocaleString()} Diamonds
                </span>
                <span className="text-line-strong">·</span>
                <span className="font-display font-semibold">{formatRs(e.price)}</span>
                <span className="text-line-strong">·</span>
                <span className="text-ink-muted">{timeAgo(e.createdAt)}</span>
                <Radio className="ml-2 h-3 w-3 shrink-0 text-brand-400" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
