"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { User, Gem, CreditCard, Landmark, Wallet, Smartphone, Check, Loader2, ShieldCheck, Zap, BadgeCheck, X, AlertTriangle, ChevronRight, PartyPopper, Copy, Info, Upload, Crown } from "lucide-react";
import { formatRs } from "@/lib/format";

export interface Pkg {
  id: number;
  diamonds: number;
  price: number;
  bonus: number;
  label: string | null;
  isPopular: boolean;
}

export interface Memb {
  id: number;
  name: string;
  price: number;
  diamondsTotal: number;
  label: string | null;
}

export interface Method {
  id: number;
  name: string;
  type: string;
  instructions: string | null;
}

function payIcon(type: string) {
  switch (type) {
    case "bank": return Landmark;
    case "payhere": return Wallet;
    case "visa":
    case "mastercard": return CreditCard;
    case "ezcash": return Smartphone;
    default: return Wallet;
  }
}

function StepHeader({ n, title, done, hint }: { n: number; title: string; done: boolean; hint: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-[13px] font-extrabold transition-all ${done ? "bg-brand-600 text-white shadow-[0_4px_12px_-4px_rgba(3,152,85,0.6)]" : "bg-brand-50 text-brand-700 ring-1 ring-brand-200"}`}>
        {done ? <Check className="h-4 w-4" /> : n}
      </span>
      <h3 className="font-display text-[15px] font-extrabold tracking-tight text-ink sm:text-base">{title}</h3>
      <span className="hidden text-[12.5px] text-ink-muted sm:inline"> | {hint}</span>
    </div>
  );
}

export default function TopUpWidget({ packages, memberships, methods }: { packages: Pkg[]; memberships: Memb[]; methods: Method[] }) {
  const [uid, setUid] = useState("");
  const [uidTouched, setUidTouched] = useState(false);
  const [orderType, setOrderType] = useState<"package" | "membership">("package");
  const [pkgId, setPkgId] = useState<number | null>(null);
  const [memId, setMemId] = useState<number | null>(null);
  const [methodName, setMethodName] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const uidValid = /^\d{6,12}$/.test(uid.trim());
  const uidError = uidTouched && uid.length > 0 && !uidValid;

  const selectedPkg = useMemo(() => packages.find((p) => p.id === pkgId) ?? null, [packages, pkgId]);
  const selectedMem = useMemo(() => memberships.find((m) => m.id === memId) ?? null, [memberships, memId]);
  const activeItem = orderType === "package" ? selectedPkg : selectedMem;

  const selectedMethod = methods.find((m) => m.name === methodName) ?? null;
  const isReceiptMissing = selectedMethod?.type === "bank" && !receiptFile;
  const ready = uidValid && activeItem !== null && methodName !== null && !isReceiptMissing;

  const submit = async () => {
    if (!ready || submitting) return;
    setSubmitting(true);
    setError(null);

    try {
      let receiptUrl = null;
      if (receiptFile) {
        const formData = new FormData();
        formData.append("file", receiptFile);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.secure_url) {
          receiptUrl = uploadData.secure_url;
        } else {
          throw new Error("Failed to upload receipt.");
        }
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerId: uid.trim(),
          orderType: orderType,
          itemId: orderType === "package" ? pkgId : memId,
          paymentMethod: methodName,
          receiptUrl: receiptUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok || !data.order) throw new Error(data.error || "Order failed");

      setOrder(data.order);
      setConfirmOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const tryBuy = () => {
    if (!uidValid) { setUidTouched(true); return; }
    if (!activeItem) { setError("Please select an item."); return; }
    if (!selectedMethod) { setError("Please select a payment method."); return; }
    if (isReceiptMissing) { setError("Please upload your payment receipt."); return; }
    setError(null);
    setConfirmOpen(true);
  };

  return (
    <div id="topup" className="relative scroll-mt-28">
      <div className="panel overflow-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-canvas-2 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
              <Zap className="h-4.5 w-4.5" />
            </span>
            <div>
              <div className="font-display text-[15px] font-extrabold text-ink">Top Up Free Fire</div>
            </div>
          </div>
        </div>

        <div className="space-y-8 p-5 sm:p-7">
          {/* STEP 1 */}
          <section className="space-y-4">
            <StepHeader n={1} title="Enter Player UID" done={uidValid} hint="your in-game player ID" />
            <div className="relative max-w-md">
              <User className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
              <input
                value={uid}
                onChange={(e) => { setUid(e.target.value.replace(/[^\d]/g, "").slice(0, 12)); setUidTouched(true); }}
                placeholder="e.g., 123456789"
                className={`input-clean w-full rounded-xl py-4 pl-12 pr-12 font-display text-[17px] font-bold ${uidError ? "border-danger" : ""}`}
              />
            </div>
          </section>

          <div className="step-line" />

          {/* STEP 2 */}
          <section className="space-y-4">
            <StepHeader n={2} title="Select Item" done={activeItem !== null} hint="packages & memberships" />
            
            {/* Tabs for Packages vs Memberships */}
            <div className="flex w-max items-center gap-1 rounded-xl bg-canvas-2 p-1.5 ring-1 ring-line">
              <button
                type="button"
                onClick={() => { setOrderType("package"); setMemId(null); }}
                className={`rounded-lg px-5 py-2 font-display text-[12.5px] font-bold transition-all ${orderType === "package" ? "bg-white text-brand-700 shadow-sm ring-1 ring-line" : "text-ink-soft hover:text-ink"}`}
              >
                💎 Diamond Packages
              </button>
              <button
                type="button"
                onClick={() => { setOrderType("membership"); setPkgId(null); }}
                className={`rounded-lg px-5 py-2 font-display text-[12.5px] font-bold transition-all ${orderType === "membership" ? "bg-white text-brand-700 shadow-sm ring-1 ring-line" : "text-ink-soft hover:text-ink"}`}
              >
                👑 Memberships
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {orderType === "package" ? (
                packages.map((p) => (
                  <div key={p.id} onClick={() => setPkgId(p.id)} className={`soft-card-lift relative cursor-pointer overflow-hidden rounded-2xl p-4 text-center ${pkgId === p.id ? "card-selected" : ""}`}>
                    {p.label && <span className="absolute left-0 top-0 rounded-br-xl bg-brand-600 px-2.5 py-1 font-display text-[8.5px] font-extrabold uppercase text-white">{p.label}</span>}
                    <div className="mt-2.5 font-display text-[17px] font-extrabold text-ink">{p.diamonds.toLocaleString()}</div>
                    <div className="mt-1 text-[10px] font-bold uppercase text-ink-muted">Diamonds</div>
                    <div className="mt-2.5 font-display text-[17px] font-extrabold text-brand-700">{formatRs(p.price)}</div>
                  </div>
                ))
              ) : (
                memberships.map((m) => (
                  <div key={m.id} onClick={() => setMemId(m.id)} className={`soft-card-lift relative cursor-pointer overflow-hidden rounded-2xl p-4 text-center ${memId === m.id ? "card-selected" : ""}`}>
                    {m.label && <span className="absolute left-0 top-0 rounded-br-xl bg-brand-600 px-2.5 py-1 font-display text-[8.5px] font-extrabold uppercase text-white">{m.label}</span>}
                    <div className="mt-3 font-display text-[16px] font-extrabold text-ink">{m.name}</div>
                    <div className="mt-1 text-[10px] font-bold uppercase text-ink-muted">Total {m.diamondsTotal} 💎</div>
                    <div className="mt-2.5 font-display text-[17px] font-extrabold text-brand-700">{formatRs(m.price)}</div>
                  </div>
                ))
              )}
            </div>
          </section>

          <div className="step-line" />

          {/* STEP 3 */}
          <section className="space-y-4">
            <StepHeader n={3} title="Select Payment" done={methodName !== null && !isReceiptMissing} hint="secure checkout" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {methods.map((m) => {
                const Icon = payIcon(m.type);
                return (
                  <button key={m.id} type="button" onClick={() => { setMethodName(m.name); setReceiptFile(null); }} className={`soft-card-lift flex flex-col items-center gap-2 rounded-2xl px-3 py-4 ${methodName === m.name ? "card-selected" : ""}`}>
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${methodName === m.name ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600"}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-display text-[11.5px] font-bold text-ink">{m.name}</span>
                  </button>
                );
              })}
            </div>

            {selectedMethod?.type === "bank" && (
              <div className="mt-3 rounded-xl border border-line bg-canvas-2 p-4">
                <div className="mb-2 text-[12.5px] font-bold text-ink">Upload Payment Receipt:</div>
                <input type="file" accept="image/*" onChange={(e) => setReceiptFile(e.target.files?.[0] || null)} className="w-full text-[12px] font-semibold text-ink-soft file:rounded-xl file:border-0 file:bg-brand-50 file:px-4 file:py-2.5 file:text-brand-700" />
              </div>
            )}
          </section>

          {/* summary bar */}
          <div className="sticky bottom-3 z-20 mt-4">
            <div className="soft-card flex items-center justify-between rounded-2xl p-4">
              <div className="text-[12.5px] font-bold text-ink">
                Total: <span className="font-display text-lg text-brand-700">{activeItem ? formatRs(activeItem.price) : "—"}</span>
              </div>
              <button onClick={tryBuy} disabled={!activeItem} className="btn-primary flex items-center gap-2 rounded-xl px-6 py-3 text-[13.5px] font-extrabold uppercase">
                <Zap className="h-4 w-4" /> Top Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      <AnimatePresence>
        {confirmOpen && activeItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm" onClick={() => !submitting && setConfirmOpen(false)}>
            <motion.div initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} onClick={(e) => e.stopPropagation()} className="panel relative w-full max-w-md overflow-hidden rounded-3xl">
              <div className="border-b border-line px-6 py-5">
                <h3 className="font-display text-lg font-extrabold text-ink">Confirm your top-up</h3>
              </div>
              <div className="space-y-3 px-6 py-5">
                <div className="flex justify-between text-[13.5px]"><span>Player UID</span><span className="font-bold">{uid}</span></div>
                <div className="flex justify-between text-[13.5px]"><span>Item</span><span className="font-bold">{orderType === 'package' ? `${(activeItem as Pkg).diamonds} Diamonds` : (activeItem as Memb).name}</span></div>
                <div className="flex justify-between text-[13.5px]"><span>Total</span><span className="font-display text-xl font-extrabold text-brand-700">{formatRs(activeItem.price)}</span></div>
                {error && <p className="text-danger text-sm font-semibold">{error}</p>}
                <button onClick={submit} disabled={submitting} className="btn-primary mt-3 flex w-full items-center justify-center gap-2 rounded-xl py-4 text-sm font-extrabold uppercase">
                  {submitting ? <Loader2 className="animate-spin" /> : <ShieldCheck />} Pay {formatRs(activeItem.price)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {order && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/55 p-4">
            <motion.div className="panel w-full max-w-md rounded-3xl text-center p-7">
              <PartyPopper className="mx-auto h-12 w-12 text-brand-600" />
              <h3 className="mt-4 font-display text-xl font-extrabold text-ink">Order placed!</h3>
              <p className="mt-2 text-[13.5px] text-ink-soft">Item is on the way to UID {order.playerId}.</p>
              <div className="mt-5 rounded-xl border border-dashed border-brand-300 bg-brand-50 py-3.5 font-display text-base font-extrabold text-brand-700">
                {order.orderRef}
              </div>
              <button onClick={() => { setOrder(null); setPkgId(null); setMemId(null); }} className="btn-primary mt-5 w-full rounded-xl py-3 font-extrabold uppercase">Done</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}