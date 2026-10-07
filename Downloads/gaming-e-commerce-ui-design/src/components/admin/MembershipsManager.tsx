"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, X, Crown, Eye, EyeOff } from "lucide-react";
import { formatRs } from "@/lib/format";

export interface AdminMembership {
  id: number;
  name: string;
  price: number;
  diamondsTotal: number;
  label: string | null;
  isActive: boolean;
  sortOrder: number;
}

const EMPTY_FORM = { name: "", price: "", diamondsTotal: "", label: "", sortOrder: "99", isActive: true };

export default function MembershipsManager({ memberships }: { memberships: AdminMembership[] }) {
  const router = useRouter();
  const [list, setList] = useState(memberships);
  const [editing, setEditing] = useState<AdminMembership | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setList(memberships), [memberships]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditing(null); setCreating(true); setError(null); };
  
  const openEdit = (m: AdminMembership) => {
    setForm({ name: m.name, price: String(m.price), diamondsTotal: String(m.diamondsTotal), label: m.label ?? "", sortOrder: String(m.sortOrder), isActive: m.isActive });
    setEditing(m); setCreating(true); setError(null);
  };

  const close = () => { setCreating(false); setEditing(null); };

  const save = async () => {
    if (saving) return;
    setSaving(true); setError(null);
    try {
      const payload = { ...form, price: Number(form.price), diamondsTotal: Number(form.diamondsTotal), sortOrder: Number(form.sortOrder) };
      const res = await fetch(editing ? `/api/admin/memberships/${editing.id}` : "/api/admin/memberships", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed");
      close();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (m: AdminMembership) => {
    if (!window.confirm(`Delete ${m.name}?`)) return;
    setBusyId(m.id);
    try {
      await fetch(`/api/admin/memberships/${m.id}`, { method: "DELETE" });
      router.refresh();
    } finally { setBusyId(null); }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 rounded-xl px-5 py-3 text-[12.5px] font-extrabold uppercase tracking-wide">
          <Plus className="h-4 w-4" /> New Membership
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((m) => (
          <div key={m.id} className={`soft-card rounded-2xl p-4 transition-all ${m.isActive ? "" : "opacity-60 saturate-50"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <Crown className="h-6 w-6" />
                </span>
                <div>
                  <div className="font-display text-[15px] font-extrabold text-ink">{m.name}</div>
                  <div className="text-[11px] text-ink-muted">Total {m.diamondsTotal} Diamonds</div>
                  <div className="mt-0.5 font-display text-[13px] font-bold text-brand-700">{formatRs(m.price)}</div>
                </div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <span className="text-[10.5px] uppercase tracking-wide text-ink-muted">
                {m.label ? `Tag: ${m.label}` : `Sort: ${m.sortOrder}`}
              </span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => openEdit(m)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-canvas-2 text-ink-soft ring-1 ring-line hover:text-brand-700"><Pencil className="h-3.5 w-3.5" /></button>
                <button onClick={() => remove(m)} disabled={busyId === m.id} className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger/6 text-danger ring-1 ring-danger/15"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {creating && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm" onClick={close}>
            <motion.div initial={{ scale: 0.94 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }} onClick={(e) => e.stopPropagation()} className="panel w-full max-w-md rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-[15px] font-extrabold text-ink"><Crown className="h-4.5 w-4.5 text-brand-600" />{editing ? "Edit Membership" : "New Membership"}</h3>
                <button onClick={close} className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted"><X className="h-4.5 w-4.5" /></button>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <label className="col-span-2 block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase text-ink-muted">Name (e.g., Weekly)</span>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-clean w-full rounded-xl px-3 py-2.5 text-[13.5px] font-bold" />
                </label>
                <label className="block"><span className="mb-1.5 block text-[10px] font-bold uppercase text-ink-muted">Total Diamonds</span>
                  <input value={form.diamondsTotal} onChange={(e) => setForm({ ...form, diamondsTotal: e.target.value.replace(/[^\d]/g, "") })} className="input-clean w-full rounded-xl px-3 py-2.5 text-[13.5px] font-bold" />
                </label>
                <label className="block"><span className="mb-1.5 block text-[10px] font-bold uppercase text-ink-muted">Price (Rs.)</span>
                  <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-clean w-full rounded-xl px-3 py-2.5 text-[13.5px] font-bold" />
                </label>
                <label className="block"><span className="mb-1.5 block text-[10px] font-bold uppercase text-ink-muted">Label (Optional)</span>
                  <input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g., Best Value" className="input-clean w-full rounded-xl px-3 py-2.5 text-[13.5px] font-bold" />
                </label>
                <label className="block"><span className="mb-1.5 block text-[10px] font-bold uppercase text-ink-muted">Sort Order</span>
                  <input value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value.replace(/[^\d]/g, "") })} className="input-clean w-full rounded-xl px-3 py-2.5 text-[13.5px] font-bold" />
                </label>
              </div>
              <div className="mt-4 flex gap-3">
                <button type="button" onClick={() => setForm({ ...form, isActive: !form.isActive })} className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 font-display text-[10.5px] font-bold uppercase tracking-[0.1em] transition-all ${form.isActive ? "bg-brand-50 text-brand-700 ring-1 ring-brand-300" : "bg-canvas-2 text-ink-muted ring-1 ring-line"}`}>
                  <span className={`h-2 w-2 rounded-full ${form.isActive ? "bg-brand-600" : "bg-line-strong"}`} /> Visible in store
                </button>
              </div>
              {error && <p className="mt-4 rounded-xl bg-danger/6 px-3 py-2.5 text-[12.5px] font-semibold text-danger ring-1 ring-danger/20">{error}</p>}
              <button onClick={save} disabled={saving} className="btn-primary mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[12.5px] font-extrabold uppercase">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} {saving ? "Saving..." : "Save Membership"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}