import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import TrackClient from "@/components/site/TrackClient";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Track Order — CHUTTE LIVE Diamond Store",
  description: "Track your Free Fire diamond top-up order status live using your CL- reference.",
};

export default function TrackPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-canvas-2">
      <div className="mesh-bg pointer-events-none absolute inset-0" />
      <div className="dot-grid pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white ring-1 ring-line">
              <Image
                src="/images/diamond-green.png"
                alt="CHUTTE LIVE diamond logo"
                fill
                sizes="40px"
                className="diamond-img object-contain p-1"
              />
            </span>
            <span className="leading-none">
              <span className="block font-display text-[15px] font-extrabold tracking-tight text-ink">
                CHUTTE <span className="text-brand-600">LIVE</span>
              </span>
              <span className="mt-0.5 block font-display text-[8.5px] font-semibold uppercase tracking-[0.26em] text-ink-muted">
                Diamond Store
              </span>
            </span>
          </Link>
          <Link href="/#topup" className="btn-outline rounded-xl px-5 py-2.5 text-[12.5px] font-bold">
            Top Up Now
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-12">
          <Suspense
            fallback={
              <div className="flex items-center gap-2 font-display text-sm font-semibold text-ink-muted">
                <Loader2 className="h-4 w-4 animate-spin" /> Scanning…
              </div>
            }
          >
            <TrackClient />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
