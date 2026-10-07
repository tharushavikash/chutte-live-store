"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, X, Gem, Eye, EyeOff, Flame } from "lucide-react";
import { formatRs } from "@/lib/format";

export interface AdminPackage {
  id: number;
  diamonds: number;
  price: number;
  bonus: number;
  label: string | null;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
}

interface FormState {
  diamonds: string;
  price: string;
  bonus: string;
  label: string;
  sortOrder: string;
  isPopular: boolean;
  isActive: boolean;
}

const EMPTY_FORM: FormState = {
  diamonds: "",
  price: "",
  bonus: "0",
  label: "",
  sortOrder: "99",
  isPopular: false,
  isActive: true,
};

export default function PackagesManager({ packages }: { packages: AdminPackage[] }) {
  const router = useRouter();
  const [list, setList] = useState(packages);
  const [editing, setEditing] = useState<AdminPackage | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => setList(packages), [packages]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditing(null);
    setCreating(true);
    setError(null);
  };

  const openEdit = (p: AdminPackage) => {
    setForm({
      diamonds: String(p.diamonds),
      price: String(p.price),
      bonus: String(p.bonus),
      label: p.label ?? "",
      sortOrder: String(p.sortOrder),
      isPopular: p.isPopular,
      isActive: p.isActive,
    });
    setEditing(p);
    setCreating(true);
    setError(null);
  };

  const close = () => {
    setCreating(false);
    setEditing(null);
  };

  const save = async () => {
    if (saving) return;
    const diamonds = Number(form.diamonds);
    const price = Number(form.price);
    if (!Number.isFinite(diamonds) || diamonds <= 0 || !Number.isFinite(price) || price <= 0) {
      setError("Diamonds and price must be positive numbers.");
      return;
    }
    setSaving(true);
    setError(null);
    const payload = {
      diamonds,
      price,
      bonus: Number(form.bonus) || 0,
      label: form.label.trim() || null,
      sortOrder: Number(form.sortOrder) || 99,
      isPopular: form.isPopular,
      isActive: form.isActive,
    };
    try {
      const res = await fetch(
        editing ? `/api/admin/packages/${editing.id}` : "/api/admin/packages",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Save failed");
      close();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (p: AdminPackage) => {
    setBusyId(p.id);
    const prev = list;
    setList((l) => l.map((x) => (x.id === p.id ? { ...x, isActive: !x.isActive } : x)));
    try {
      const res = await fetch(`/api/admin/packages/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !p.isActive }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setList(prev);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (p: AdminPackage) => {
    if (!window.confirm(`Delete the ${p.diamonds} Diamonds package? This cannot be undone.`)) {
      return;
    }
    setBusyId(p.id);
    const prev = list;
    setList((l) => l.filter((x) => x.id !== p.id));
    try {
      const res = await fetch(`/api/admin/packages/${p.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setList(prev);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={openCreate}
          className="btn-primary flex items-center gap-2 rounded-xl px-5 py-3 text-[12.5px] font-extrabold uppercase tracking-wide"
        >
          <Plus className="h-4 w-4" /> New Package
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map((p) => (
          <div
            key={p.id}
            className={`soft-card rounded-2xl p-4 transition-all ${
              p.isActive ? "" : "opacity-60 saturate-50"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <Gem className="h-6 w-6" />
                </span>
                <div>
                  <div className="font-display text-[15px] font-extrabold text-ink">
                    {p.diamonds.toLocaleString()} 💎
                    {p.bonus > 0 && (
                      <span className="ml-1.5 text-[10.5px] font-bold text-brand-600">
                        +{p.bonus}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 font-display text-[13px] font-bold text-brand-700">
                    {formatRs(p.price)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span
                  className={`rounded-full px-2 py-0.5 font-display text-[8.5px] font-bold uppercase tracking-[0.12em] ring-1 ${
                    p.isActive
                      ? "bg-brand-50 text-brand-700 ring-brand-200"
                      : "bg-danger/6 text-danger ring-danger/20"
                  }`}
                >
                  {p.isActive ? "Live" : "Hidden"}
                </span>
                {p.isPopular && (
                  <span className="flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 font-display text-[8.5px] font-bold uppercase tracking-[0.12em] text-gold ring-1 ring-gold/25">
                    <Flame className="h-2.5 w-2.5" /> Hot
                  </span>
                )}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
              <span className="text-[10.5px] uppercase tracking-wide text-ink-muted">
                {p.label ? `Tag: ${p.label}` : `Sort: ${p.sortOrder}`}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleActive(p)}
                  disabled={busyId === p.id}
                  title={p.isActive ? "Hide from store" : "Show in store"}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100 transition-all hover:bg-brand-100"
                >
                  {busyId === p.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : p.isActive ? (
                    <Eye className="h-3.5 w-3.5" />
                  ) : (
                    <EyeOff className="h-3.5 w-3.5" />
                  )}
                </button>
                <button
                  onClick={() => openEdit(p)}
                  title="Edit"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-canvas-2 text-ink-soft ring-1 ring-line transition-all hover:text-brand-700 hover:ring-brand-300"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => remove(p)}
                  disabled={busyId === p.id}
                  title="Delete"
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-danger/6 text-danger ring-1 ring-danger/15 transition-all hover:bg-danger/12"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="soft-card col-span-full rounded-2xl px-5 py-12 text-center text-[13.5px] text-ink-muted">
            No packages yet — create your first one.
          </div>
        )}
      </div>

      {/* Create / Edit modal */}
      <AnimatePresence>
        {creating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <motion.div
              initial={{ scale: 0.94, y: 18, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 340 }}
              onClick={(e) => e.stopPropagation()}
              className="panel w-full max-w-md rounded-3xl p-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-2 font-display text-[15px] font-extrabold text-ink">
                  <Gem className="h-4.5 w-4.5 text-brand-600" />
                  {editing ? "Edit package" : "New package"}
                </h3>
                <button
                  onClick={close}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-canvas-2 hover:text-ink"
                  aria-label="Close"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { key: "diamonds", label: "Diamonds", ph: "115" },
                  { key: "price", label: "Price (Rs.)", ph: "350" },
                  { key: "bonus", label: "Bonus 💎", ph: "0" },
                  { key: "sortOrder", label: "Sort order", ph: "1" },
                ].map((f) => (
                  <label key={f.key} className="block">
                    <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted">
                      {f.label}
                    </span>
                    <input
                      value={form[f.key as keyof FormState] as string}
                      onChange={(e) =>
                        setForm((s) => ({
                          ...s,
                          [f.key]:
                            f.key === "diamonds" || f.key === "bonus" || f.key === "sortOrder"
                              ? e.target.value.replace(/[^\d]/g, "")
                              : e.target.value,
                        }))
                      }
                      placeholder={f.ph}
                      inputMode="numeric"
                      className="input-clean w-full rounded-xl px-3 py-2.5 text-[13.5px] font-bold"
                    />
                  </label>
                ))}
                <label className="col-span-2 block">
                  <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted">
                    Label (optional)
                  </span>
                  <input
                    value={form.label}
                    onChange={(e) => setForm((s) => ({ ...s, label: e.target.value }))}
                    placeholder="e.g., Best Value"
                    maxLength={20}
                    className="input-clean w-full rounded-xl px-3 py-2.5 text-[13.5px] font-bold"
                  />
                </label>
              </div>

              <div className="mt-4 flex gap-3">
                {(
                  [
                    ["isPopular", "🔥 Hot pick"],
                    ["isActive", "Visible in store"],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm((s) => ({ ...s, [key]: !s[key] }))}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 font-display text-[10.5px] font-bold uppercase tracking-[0.1em] transition-all ${
                      form[key]
                        ? "bg-brand-50 text-brand-700 ring-1 ring-brand-300"
                        : "bg-canvas-2 text-ink-muted ring-1 ring-line"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        form[key] ? "bg-brand-600" : "bg-line-strong"
                      }`}
                    />
                    {label}
                  </button>
                ))}
              </div>

              {error && (
                <p className="mt-4 rounded-xl bg-danger/6 px-3 py-2.5 text-[12.5px] font-semibold text-danger ring-1 ring-danger/20">
                  {error}
                </p>
              )}

              <button
                onClick={save}
                disabled={saving}
                className="btn-primary mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[12.5px] font-extrabold uppercase tracking-wide"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {saving ? "Saving…" : editing ? "Save changes" : "Create package"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
