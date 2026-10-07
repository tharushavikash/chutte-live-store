"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, RefreshCcw } from "lucide-react";
import { formatRs, ORDER_STATUSES } from "@/lib/format";

export interface AdminOrder {
  id: number;
  orderRef: string;
  playerId: string;
  diamonds: number;
  price: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gold/10 text-gold ring-gold/25",
  processing: "bg-info/8 text-info ring-info/20",
  completed: "bg-brand-50 text-brand-700 ring-brand-200",
  cancelled: "bg-danger/6 text-danger ring-danger/20",
};

export default function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  const router = useRouter();
  const [list, setList] = useState(orders);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [busyId, setBusyId] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => setList(orders), [orders]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return list.filter((o) => {
      if (filter !== "all" && o.status !== filter) return false;
      if (!q) return true;
      return (
        o.orderRef.toLowerCase().includes(q) ||
        o.playerId.includes(q) ||
        o.paymentMethod.toLowerCase().includes(q)
      );
    });
  }, [list, query, filter]);

  const updateStatus = async (id: number, status: string) => {
    setBusyId(id);
    const prev = list;
    setList((l) => l.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("failed");
      router.refresh();
    } catch {
      setList(prev);
    } finally {
      setBusyId(null);
    }
  };

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: list.length };
    for (const s of ORDER_STATUSES) c[s] = list.filter((o) => o.status === s).length;
    return c;
  }, [list]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reference, UID or payment…"
            className="input-clean w-full rounded-xl py-2.5 pl-10 pr-4 text-[13px]"
          />
        </div>
        <button
          onClick={() => {
            setRefreshing(true);
            router.refresh();
            setTimeout(() => setRefreshing(false), 600);
          }}
          className="btn-outline flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[11.5px] font-bold uppercase tracking-wide"
        >
          <RefreshCcw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", ...ORDER_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-3.5 py-1.5 font-display text-[10.5px] font-bold uppercase tracking-[0.1em] transition-all ${
              filter === s
                ? "bg-brand-600 text-white shadow-[0_4px_12px_-4px_rgba(3,152,85,0.6)]"
                : "bg-white text-ink-soft ring-1 ring-line hover:text-brand-700 hover:ring-brand-300"
            }`}
          >
            {s} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      <div className="soft-card overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-[12.5px]">
            <thead>
              <tr className="border-b border-line bg-canvas-2 text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                <th className="px-5 py-3.5">Reference</th>
                <th className="px-3 py-3.5">Player UID</th>
                <th className="px-3 py-3.5">Package</th>
                <th className="px-3 py-3.5">Amount</th>
                <th className="px-3 py-3.5">Payment</th>
                <th className="px-3 py-3.5">Date</th>
                <th className="px-3 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Set</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.map((o) => (
                <tr key={o.id} className="row-hover">
                  <td className="px-5 py-3 font-display font-bold tracking-wide text-brand-700">
                    {o.orderRef}
                  </td>
                  <td className="px-3 py-3 tracking-wider text-ink">{o.playerId}</td>
                  <td className="px-3 py-3 text-ink-soft">{o.diamonds.toLocaleString()} 💎</td>
                  <td className="px-3 py-3 font-display font-bold text-ink">
                    {formatRs(o.price)}
                  </td>
                  <td className="px-3 py-3 text-ink-soft">{o.paymentMethod}</td>
                  <td className="whitespace-nowrap px-3 py-3 text-ink-muted">
                    {new Date(o.createdAt).toLocaleDateString()}{" "}
                    {new Date(o.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 font-display text-[9.5px] font-bold uppercase tracking-[0.1em] ring-1 ${STATUS_STYLES[o.status]}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="relative inline-flex items-center">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        disabled={busyId === o.id}
                        className="clean-select cursor-pointer rounded-lg border border-line bg-white py-1.5 pl-3 pr-8 font-display text-[11px] font-bold text-ink outline-none transition-colors hover:border-brand-400 focus:border-brand-500"
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      {busyId === o.id && (
                        <Loader2 className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 animate-spin text-brand-600" />
                      )}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[13.5px] text-ink-muted">
                    No orders match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
