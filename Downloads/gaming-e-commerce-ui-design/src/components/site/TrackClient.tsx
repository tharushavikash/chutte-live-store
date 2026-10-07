"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Package,
  CreditCard,
  Gem,
  Check,
  XCircle,
  Loader2,
  Radar,
  ArrowLeft,
  CircleCheck,
} from "lucide-react";
import { formatRs } from "@/lib/format";

interface TrackedOrder {
  orderRef: string;
  playerId: string;
  diamonds: number;
  price: number;
  paymentMethod: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: string;
}

const STEPS = [
  { key: "placed", label: "Order placed", icon: Package },
  { key: "paid", label: "Payment verified", icon: CreditCard },
  { key: "delivered", label: "Diamonds delivered", icon: Gem },
];

function stepState(status: TrackedOrder["status"], index: number): "done" | "active" | "todo" {
  if (status === "completed") return "done";
  if (status === "cancelled") return "todo";
  if (status === "pending") return index === 0 ? "done" : index === 1 ? "active" : "todo";
  return index <= 1 ? "done" : "active"; // processing
}

const BADGE: Record<string, string> = {
  completed: "bg-brand-50 text-brand-700 ring-brand-200",
  cancelled: "bg-danger/8 text-danger ring-danger/20",
  processing: "bg-info/8 text-info ring-info/20",
  pending: "bg-gold/10 text-gold ring-gold/25",
};

export default function TrackClient() {
  const params = useSearchParams();
  const [ref, setRef] = useState(params.get("ref") ?? "");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (value: string) => {
    const r = value.trim().toUpperCase();
    if (!r) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/track?ref=${encodeURIComponent(r)}`);
      const data = (await res.json()) as { ok: boolean; order?: TrackedOrder; error?: string };
      if (!res.ok || !data.ok || !data.order) throw new Error(data.error || "Order not found");
      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initial = params.get("ref");
    if (initial) lookup(initial);
  }, [params, lookup]);

  return (
    <div className="w-full max-w-xl">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-muted transition-colors hover:text-brand-700"
      >
        <ArrowLeft className="h-4 w-4" /> Back to store
      </Link>

      <h1 className="mt-6 font-display text-[28px] font-extrabold tracking-tight text-ink sm:text-4xl">
        Track <span className="text-gradient-brand">your order</span>
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-ink-soft">
        Enter the CL- reference from your confirmation to see live delivery status.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          lookup(ref);
        }}
        className="mt-6 flex gap-3"
      >
        <div className="relative flex-1">
          <Radar className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
          <input
            value={ref}
            onChange={(e) => setRef(e.target.value.toUpperCase())}
            placeholder="CL-XXXXXXXX"
            className="input-clean w-full rounded-xl py-4 pl-12 pr-4 font-display text-sm font-bold tracking-[0.14em]"
          />
        </div>
        <button
          type="submit"
          disabled={loading || !ref.trim()}
          className="btn-primary flex items-center gap-2 rounded-xl px-6 text-[13px] font-extrabold uppercase"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Scan
        </button>
      </form>

      {error && (
        <div className="mt-6 rounded-2xl bg-danger/6 p-4 text-[13.5px] font-semibold text-danger ring-1 ring-danger/20">
          {error} — double-check your reference and try again.
        </div>
      )}

      {order && (
        <div className="panel mt-6 overflow-hidden rounded-3xl">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-canvas-2 px-6 py-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-muted">
                Order reference
              </div>
              <div className="mt-1 font-display text-lg font-extrabold tracking-[0.1em] text-brand-700">
                {order.orderRef}
              </div>
            </div>
            <span
              className={`rounded-full px-3.5 py-1.5 font-display text-[10px] font-extrabold uppercase tracking-[0.14em] ring-1 ${BADGE[order.status]}`}
            >
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 px-6 py-5">
            {[
              ["UID", order.playerId],
              ["Diamonds", order.diamonds.toLocaleString()],
              ["Total", formatRs(order.price)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-canvas-2 px-3 py-3 text-center">
                <div className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                  {k}
                </div>
                <div className="mt-1 truncate font-display text-[13.5px] font-extrabold text-ink">
                  {v}
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 pb-6">
            {order.status === "cancelled" ? (
              <div className="flex items-start gap-3 rounded-2xl bg-danger/6 p-4 text-[13.5px] font-semibold text-danger ring-1 ring-danger/20">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                This order was cancelled. Contact support on WhatsApp to resolve any payment
                issue.
              </div>
            ) : (
              <div className="space-y-0">
                {STEPS.map((s, i) => {
                  const state = stepState(order.status, i);
                  const last = i === STEPS.length - 1;
                  return (
                    <div key={s.key} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                            state === "done"
                              ? "bg-brand-600 text-white"
                              : state === "active"
                                ? "bg-info/10 text-info ring-2 ring-info/30"
                                : "bg-canvas-2 text-ink-muted ring-1 ring-line"
                          }`}
                        >
                          {state === "done" ? (
                            <Check className="h-5 w-5" />
                          ) : state === "active" ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <s.icon className="h-5 w-5" />
                          )}
                        </span>
                        {!last && (
                          <span
                            className={`w-0.5 flex-1 ${state === "done" ? "bg-brand-500" : "bg-line"}`}
                          />
                        )}
                      </div>
                      <div className="pb-5 pt-2.5">
                        <div
                          className={`font-display text-[13.5px] font-bold ${
                            state === "todo" ? "text-ink-muted" : "text-ink"
                          }`}
                        >
                          {s.label}
                        </div>
                        {state === "active" && (
                          <div className="mt-1 text-[12px] text-info">In progress…</div>
                        )}
                        {state === "done" && last && (
                          <div className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-brand-700">
                            <CircleCheck className="h-3.5 w-3.5" /> Delivered — check your
                            in-game vault!
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
