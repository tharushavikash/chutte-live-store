"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Loader2, ShieldAlert, ArrowLeft, Gem } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Login failed");
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas-2 p-4">
      <div className="mesh-bg pointer-events-none absolute inset-0" />
      <div className="dot-grid pointer-events-none absolute inset-0" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="panel relative w-full max-w-sm rounded-3xl p-8"
      >
        <Link
          href="/"
          className="absolute left-5 top-5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-muted transition-colors hover:text-brand-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Store
        </Link>

        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-[0_8px_20px_-8px_rgba(3,152,85,0.7)]">
            <Gem className="h-7 w-7" />
          </span>
          <h1 className="mt-4 font-display text-lg font-extrabold tracking-tight text-ink">
            CHUTTE <span className="text-brand-600">LIVE</span>
          </h1>
          <p className="mt-1 font-display text-[9.5px] font-bold uppercase tracking-[0.3em] text-ink-muted">
            Command Center
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              autoFocus
              className="input-clean w-full rounded-xl py-4 pl-12 pr-4 font-display text-sm font-bold tracking-wide"
            />
          </div>
          {error && (
            <p className="flex items-center gap-2 rounded-xl bg-danger/6 px-3 py-2.5 text-[12.5px] font-semibold text-danger ring-1 ring-danger/20">
              <ShieldAlert className="h-4 w-4 shrink-0" /> {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="btn-primary flex w-full items-center justify-center gap-2 rounded-xl py-4 text-[13.5px] font-extrabold uppercase tracking-wide"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Authenticating…" : "Access Panel"}
          </button>
        </form>
        <p className="mt-5 text-center text-[11px] leading-relaxed text-ink-muted">
          Default password: <span className="font-semibold text-ink-soft">chutte2024</span> — set
          ADMIN_PASSWORD env to change.
        </p>
      </motion.div>
    </main>
  );
}
