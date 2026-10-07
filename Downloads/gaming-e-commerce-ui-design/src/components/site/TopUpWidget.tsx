"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  Gem,
  CreditCard,
  Landmark,
  Wallet,
  Smartphone,
  Check,
  Loader2,
  ShieldCheck,
  Zap,
  BadgeCheck,
  X,
  AlertTriangle,
  ChevronRight,
  PartyPopper,
  Copy,
  Info,
} from "lucide-react";
import { formatRs } from "@/lib/format";

export interface Pkg {
  id: number;
  diamonds: number;
  price: number;
  bonus: number;
  label: string | null;
  isPopular: boolean;
}

export interface Method {
  id: number;
  name: string;
  type: string;
  instructions: string | null;
}

interface CreatedOrder {
  orderRef: string;
  playerId: string;
  diamonds: number;
  price: number;
  paymentMethod: string;
  status: string;
}

function payIcon(type: string) {
  switch (type) {
    case "bank":
      return Landmark;
    case "payhere":
      return Wallet;
    case "visa":
      return CreditCard;
    case "mastercard":
      return CreditCard;
    case "ezcash":
      return Smartphone;
    default:
      return Wallet;
  }
}

function StepHeader({
  n,
  title,
  done,
  hint,
}: {
  n: number;
  title: string;
  done: boolean;
  hint: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-extrabold transition-all ${
          done
            ? "bg-brand-600 text-white shadow-[0_4px_12px_-4px_rgba(3,152,85,0.6)]"
            : "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
        }`}
      >
        {done ? <Check className="h-4 w-4" /> : n}
      </span>
      <h3 className="font-display text-[15px] font-extrabold tracking-tight text-ink sm:text-base">
        {title}
      </h3>
      <span className="hidden text-[12.5px] text-ink-muted sm:inline">— {hint}</span>
      {done && (
        <span className="pill-green ml-auto hidden rounded-full px-2.5 py-1 font-display text-[9.5px] font-bold uppercase tracking-wider sm:inline-flex">
          Done
        </span>
      )}
    </div>
  );
}

export default function TopUpWidget({
  packages,
  methods,
}: {
  packages: Pkg[];
  methods: Method[];
}) {
  const [uid, setUid] = useState("");
  const [uidTouched, setUidTouched] = useState(false);
  const [pkgId, setPkgId] = useState<number | null>(null);
  const [methodName, setMethodName] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<CreatedOrder | null>(null);
  const [copied, setCopied] = useState(false);

  const uidValid = /^\d{6,12}$/.test(uid.trim());
  const uidError = uidTouched && uid.length > 0 && !uidValid;
  const selectedPkg = useMemo(
    () => packages.find((p) => p.id === pkgId) ?? null,
    [packages, pkgId]
  );
  const selectedMethod = methods.find((m) => m.name === methodName) ?? null;
  const ready = uidValid && pkgId !== null && methodName !== null;

  const submit = async () => {
    if (!ready || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: uid.trim(),
          packageId: pkgId,
          paymentMethod: methodName,
        }),
      });
      const data = (await res.json()) as { ok: boolean; order?: CreatedOrder; error?: string };
      if (!res.ok || !data.ok || !data.order) throw new Error(data.error || "Order failed");
      setOrder(data.order);
      setConfirmOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Order failed");
    } finally {
      setSubmitting(false);
    }
  };

  const tryBuy = () => {
    if (!uidValid) {
      setUidTouched(true);
      document.getElementById("uid-input")?.focus();
      document.getElementById("uid-input")?.scrollIntoView({ block: "center" });
      return;
    }
    if (!selectedPkg) {
      document.getElementById("pkg-grid")?.scrollIntoView({ block: "center" });
      return;
    }
    setError(null);
    setConfirmOpen(true);
  };

  const resetAfterSuccess = () => {
    setOrder(null);
    setPkgId(null);
    setMethodName(null);
    setCopied(false);
  };

  return (
    <div id="topup" className="relative scroll-mt-28">
      <div className="panel overflow-hidden">
        {/* widget header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-canvas-2 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Zap className="h-4.5 w-4.5" />
            </span>
            <div>
              <div className="font-display text-[15px] font-extrabold text-ink">
                Top Up Free Fire Diamonds
              </div>
              <div className="text-[11.5px] text-ink-muted">
                Complete the 3 steps below — it takes less than a minute
              </div>
            </div>
          </div>
          <span className="pill-green flex items-center gap-1.5 rounded-full px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="h-3.5 w-3.5" /> No login required
          </span>
        </div>

        <div className="space-y-8 p-5 sm:p-7">
          {/* STEP 1 */}
          <section className="space-y-4">
            <StepHeader
              n={1}
              title="Enter Player UID"
              done={uidValid}
              hint="your in-game player ID"
            />
            <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="relative">
                <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
                <input
                  id="uid-input"
                  value={uid}
                  onChange={(e) => {
                    setUid(e.target.value.replace(/[^\d]/g, "").slice(0, 12));
                    if (e.target.value) setUidTouched(true);
                  }}
                  onBlur={() => setUidTouched(true)}
                  placeholder="e.g., 123456789"
                  inputMode="numeric"
                  autoComplete="off"
                  aria-invalid={uidError}
                  className={`input-clean w-full rounded-xl py-4 pl-12 pr-12 font-display text-[17px] font-bold tracking-[0.12em] ${
                    uidError ? "border-danger" : ""
                  }`}
                />
                {uidValid && (
                  <span className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-700">
                    <BadgeCheck className="h-3.5 w-3.5" /> Valid
                  </span>
                )}
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-canvas-2 px-4 py-3 lg:max-w-[260px]">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                <p className="text-[11.5px] leading-relaxed text-ink-soft">
                  Open Free Fire → tap your avatar → your UID is shown under your nickname.
                </p>
              </div>
            </div>
            {uidError && (
              <p className="flex items-center gap-2 text-[12.5px] font-semibold text-danger">
                <AlertTriangle className="h-4 w-4" /> UID must be 6–12 digits. Find it on your
                in-game profile.
              </p>
            )}
          </section>

          <div className="step-line" />

          {/* STEP 2 */}
          <section className="space-y-4">
            <StepHeader
              n={2}
              title="Select Diamonds"
              done={pkgId !== null}
              hint="cheapest rates in Sri Lanka"
            />
            <div id="pkg-grid" className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {packages.map((p) => {
                const selected = pkgId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setPkgId(p.id)}
                    className={`soft-card-lift relative cursor-pointer overflow-hidden rounded-2xl p-4 text-center ${
                      selected ? "card-selected" : ""
                    }`}
                  >
                    {p.label && (
                      <span className="absolute left-0 top-0 rounded-br-xl bg-brand-600 px-2.5 py-1 font-display text-[8.5px] font-extrabold uppercase tracking-[0.12em] text-white">
                        {p.label}
                      </span>
                    )}
                    {p.isPopular && (
                      <span className="absolute right-2 top-2 rounded-full bg-gold/12 px-2 py-0.5 font-display text-[8.5px] font-extrabold uppercase tracking-[0.1em] text-gold ring-1 ring-gold/30">
                        🔥 Hot
                      </span>
                    )}
                    <div className="relative mx-auto mt-3 h-16 w-16 sm:h-[72px] sm:w-[72px]">
                      <Image
                        src="/images/diamond-green.png"
                        alt={`${p.diamonds} Free Fire diamonds`}
                        fill
                        sizes="76px"
                        className="object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-2.5 font-display text-[17px] font-extrabold leading-none text-ink">
                      {p.diamonds.toLocaleString()}
                    </div>
                    <div className="mt-1 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
                      Diamonds
                    </div>
                    {p.bonus > 0 && (
                      <div className="mt-1.5 inline-block rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700">
                        +{p.bonus} bonus
                      </div>
                    )}
                    <div className="mt-2.5 font-display text-[17px] font-extrabold text-brand-700">
                      {formatRs(p.price)}
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPkgId(p.id);
                        tryBuy();
                      }}
                      className={`mt-3 w-full rounded-xl py-2.5 font-display text-[11.5px] font-extrabold uppercase tracking-wide transition-all ${
                        selected ? "btn-primary" : "btn-outline"
                      }`}
                    >
                      Buy Now
                    </button>
                  </div>
                );
              })}
              {packages.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-line-strong px-5 py-12 text-center text-sm text-ink-muted">
                  No packages are available right now. Please check back soon.
                </div>
              )}
            </div>
          </section>

          <div className="step-line" />

          {/* STEP 3 */}
          <section className="space-y-4">
            <StepHeader
              n={3}
              title="Select Payment"
              done={methodName !== null}
              hint="secure LKR checkout"
            />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {methods.map((m) => {
                const Icon = payIcon(m.type);
                const selected = methodName === m.name;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethodName(m.name)}
                    className={`soft-card-lift flex flex-col items-center gap-2 rounded-2xl px-3 py-4 ${
                      selected ? "card-selected" : ""
                    }`}
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
                        selected
                          ? "bg-brand-600 text-white"
                          : "bg-brand-50 text-brand-600 ring-1 ring-brand-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-display text-[11.5px] font-bold text-ink">
                      {m.name}
                    </span>
                  </button>
                );
              })}
            </div>
            {selectedMethod?.instructions && (
              <p className="flex items-start gap-2 rounded-xl bg-canvas-2 px-4 py-3 text-[12.5px] leading-relaxed text-ink-soft">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
                {selectedMethod.instructions}
              </p>
            )}
          </section>

          {/* summary bar */}
          <div className="sticky bottom-3 z-20">
            <div className="soft-card flex flex-col gap-3 rounded-2xl p-4 shadow-[0_1px_3px_rgba(16,40,28,0.05),0_18px_40px_-20px_rgba(16,40,28,0.35)] sm:flex-row sm:items-center">
              <div className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-1.5 text-[12.5px]">
                <span className="flex items-center gap-2 text-ink-soft">
                  <Gem className="h-4 w-4 text-brand-600" />
                  {selectedPkg ? (
                    <span className="font-display font-bold text-ink">
                      {selectedPkg.diamonds.toLocaleString()} Diamonds
                    </span>
                  ) : (
                    <span className="italic text-ink-muted">no package selected</span>
                  )}
                </span>
                <span className="hidden items-center gap-2 text-ink-soft sm:flex">
                  <User className="h-4 w-4 text-brand-600" />
                  {uidValid ? (
                    <span className="font-display font-bold tracking-wider text-ink">
                      UID {uid}
                    </span>
                  ) : (
                    <span className="italic text-ink-muted">UID required</span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-line pt-3 sm:justify-end sm:border-0 sm:pt-0">
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                    Total
                  </div>
                  <div className="font-display text-xl font-extrabold text-brand-700">
                    {selectedPkg ? formatRs(selectedPkg.price) : "—"}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={tryBuy}
                  disabled={!selectedPkg}
                  className="btn-primary inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-[13.5px] font-extrabold uppercase"
                >
                  <Zap className="h-4 w-4" />
                  Top Up
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- CONFIRM MODAL ---------- */}
      <AnimatePresence>
        {confirmOpen && selectedPkg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
            onClick={() => !submitting && setConfirmOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, y: 10, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 340 }}
              onClick={(e) => e.stopPropagation()}
              className="panel relative w-full max-w-md overflow-hidden rounded-3xl"
            >
              <div className="border-b border-line px-6 py-5">
                <h3 className="font-display text-lg font-extrabold tracking-tight text-ink">
                  Confirm your top-up
                </h3>
                <p className="mt-1 text-[12.5px] text-ink-muted">
                  Please double-check your details before paying.
                </p>
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-canvas-2 hover:text-ink"
                  aria-label="Close"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>
              <div className="space-y-3 px-6 py-5">
                {[
                  ["Player UID", uid, "font-display font-bold tracking-wider text-ink"],
                  [
                    "Package",
                    `${selectedPkg.diamonds.toLocaleString()} Diamonds${
                      selectedPkg.bonus ? ` +${selectedPkg.bonus} bonus` : ""
                    }`,
                    "font-display font-bold text-ink",
                  ],
                  ["Payment", methodName ?? "", "font-display font-bold text-ink"],
                  ["Delivery", "Instant · 2–5 seconds", "font-semibold text-brand-700"],
                ].map(([k, v, cls]) => (
                  <div key={k} className="flex items-center justify-between gap-4 text-[13.5px]">
                    <span className="text-ink-muted">{k}</span>
                    <span className={`${cls} text-right`}>{v}</span>
                  </div>
                ))}
                <div className="step-line" />
                <div className="flex items-center justify-between">
                  <span className="font-display text-[13px] font-bold uppercase tracking-[0.12em] text-ink-muted">
                    Total
                  </span>
                  <span className="font-display text-2xl font-extrabold text-brand-700">
                    {formatRs(selectedPkg.price)}
                  </span>
                </div>
                {error && (
                  <p className="flex items-center gap-2 rounded-xl bg-danger/8 px-3 py-2.5 text-[12.5px] font-semibold text-danger ring-1 ring-danger/20">
                    <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
                  </p>
                )}
                <button
                  onClick={submit}
                  disabled={submitting}
                  className="btn-primary mt-1 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-extrabold uppercase tracking-wide"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" /> Pay {formatRs(selectedPkg.price)}
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] leading-relaxed text-ink-muted">
                  By continuing you agree to our terms. Deliveries to wrong UIDs cannot be
                  reversed.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------- SUCCESS MODAL ---------- */}
      <AnimatePresence>
        {order && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/55 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: "spring", damping: 24, stiffness: 320 }}
              className="panel relative w-full max-w-md overflow-hidden rounded-3xl text-center"
            >
              <div className="px-7 py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 13, stiffness: 260, delay: 0.12 }}
                  className="mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-brand-50 ring-1 ring-brand-200"
                >
                  <PartyPopper className="h-8 w-8 text-brand-600" />
                </motion.div>
                <h3 className="mt-5 font-display text-xl font-extrabold tracking-tight text-ink">
                  Order placed successfully!
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                  {order.diamonds.toLocaleString()} 💎 are on the way to UID{" "}
                  <span className="font-semibold text-ink">{order.playerId}</span> via{" "}
                  {order.paymentMethod}.
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(order.orderRef).catch(() => {});
                    setCopied(true);
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-brand-300 bg-brand-50 py-3.5 font-display text-base font-extrabold tracking-[0.14em] text-brand-700 transition-colors hover:bg-brand-100"
                >
                  {order.orderRef}
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </button>
                <p className="mt-2 text-[10.5px] uppercase tracking-wider text-ink-muted">
                  {copied ? "Copied to clipboard" : "Tap to copy — use it to track your order"}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Link
                    href={`/track?ref=${order.orderRef}`}
                    className="btn-outline rounded-xl py-3 text-[12.5px] font-bold"
                  >
                    Track Order
                  </Link>
                  <button
                    onClick={resetAfterSuccess}
                    className="btn-primary rounded-xl py-3 text-[12.5px] font-extrabold uppercase"
                  >
                    Done
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
