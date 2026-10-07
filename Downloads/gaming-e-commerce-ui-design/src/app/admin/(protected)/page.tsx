import Link from "next/link";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { count, sum, eq, desc, gte } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";
import { formatRs, timeAgo } from "@/lib/format";
import {
  CircleDollarSign,
  ShoppingCart,
  Hourglass,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gold/10 text-gold ring-gold/25",
  processing: "bg-info/8 text-info ring-info/20",
  completed: "bg-brand-50 text-brand-700 ring-brand-200",
  cancelled: "bg-danger/6 text-danger ring-danger/20",
};

export default async function AdminDashboard() {
  await ensureSeeded();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const [[revAgg], [pendingAgg], [totalAgg], [todayAgg], recent] = await Promise.all([
    db.select({ total: sum(orders.price), n: count() }).from(orders).where(eq(orders.status, "completed")),
    db.select({ n: count() }).from(orders).where(eq(orders.status, "pending")),
    db.select({ n: count() }).from(orders),
    db.select({ n: count() }).from(orders).where(gte(orders.createdAt, todayStart)),
    db.select().from(orders).orderBy(desc(orders.createdAt)).limit(8),
  ]);

  const stats = [
    {
      label: "Total revenue",
      value: formatRs(Number(revAgg.total ?? 0)),
      sub: `${Number(revAgg.n)} completed orders`,
      icon: CircleDollarSign,
      tone: "bg-brand-50 text-brand-700 ring-brand-100",
    },
    {
      label: "All orders",
      value: Number(totalAgg.n).toLocaleString(),
      sub: "lifetime top-ups",
      icon: ShoppingCart,
      tone: "bg-info/8 text-info ring-info/15",
    },
    {
      label: "Pending",
      value: Number(pendingAgg.n).toLocaleString(),
      sub: "awaiting payment",
      icon: Hourglass,
      tone: "bg-gold/10 text-gold ring-gold/20",
    },
    {
      label: "Today",
      value: Number(todayAgg.n).toLocaleString(),
      sub: "orders since midnight",
      icon: TrendingUp,
      tone: "bg-brand-50 text-brand-600 ring-brand-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-[24px] font-extrabold tracking-tight text-ink">
          Dashboard
        </h1>
        <p className="mt-1 text-[13px] text-ink-soft">
          Live overview of the diamond supply line.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="soft-card rounded-2xl p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${s.tone}`}>
                <s.icon className="h-5 w-5" />
              </span>
              <span className="text-right text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                {s.label}
              </span>
            </div>
            <div className="mt-4 font-display text-xl font-extrabold text-ink sm:text-[22px]">
              {s.value}
            </div>
            <div className="mt-0.5 text-[11.5px] text-ink-muted">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="soft-card overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-[14px] font-extrabold text-ink">Latest orders</h2>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 font-display text-[11.5px] font-bold text-brand-700 transition-colors hover:text-brand-800"
          >
            View all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-line">
          {recent.map((o) => (
            <div
              key={o.id}
              className="row-hover flex flex-wrap items-center gap-x-4 gap-y-1.5 px-5 py-3.5"
            >
              <span className="w-32 font-display text-[12.5px] font-bold tracking-wide text-brand-700">
                {o.orderRef}
              </span>
              <span className="w-24 text-[12.5px] tracking-wider text-ink-soft">
                {o.playerId.slice(0, 2)}***{o.playerId.slice(-2)}
              </span>
              <span className="flex-1 text-[12.5px] text-ink-soft">
  {o.itemName} · {o.paymentMethod}
</span>
              <span className="font-display text-[12.5px] font-bold text-ink">
                {formatRs(o.price)}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 font-display text-[9.5px] font-bold uppercase tracking-[0.1em] ring-1 ${STATUS_STYLES[o.status]}`}
              >
                {o.status}
              </span>
              <span className="hidden w-20 text-right text-[11px] text-ink-muted sm:block">
                {timeAgo(o.createdAt.toISOString())}
              </span>
            </div>
          ))}
          {recent.length === 0 && (
            <div className="px-5 py-12 text-center text-[13.5px] text-ink-muted">
              No orders yet — share the store link to get the first drop.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
