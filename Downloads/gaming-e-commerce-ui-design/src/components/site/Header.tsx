"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Zap, ShieldCheck, Phone } from "lucide-react";

const NAV = [
  { label: "Top Up", href: "/#topup" },
  { label: "Packages", href: "/#topup" },
  { label: "Payments", href: "/#payments" },
  { label: "FAQ", href: "/#faq" },
  { label: "Track Order", href: "/track" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* announcement bar */}
      <div className="bg-brand-700 text-white">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-2 px-4 text-[11px] font-medium sm:text-xs">
          <Zap className="h-3.5 w-3.5 shrink-0 text-brand-300" />
          <span className="truncate">
            Fast &amp; Secure Free Fire Top-Up — Instant delivery in under 60 seconds
          </span>
          <span className="hidden items-center gap-1.5 border-l border-white/25 pl-3 sm:flex">
            <Phone className="h-3 w-3" /> Support 24/7
          </span>
        </div>
      </div>

      {/* main nav */}
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "border-b border-line bg-white/90 shadow-[0_2px_16px_-6px_rgba(16,40,28,0.14)] backdrop-blur-xl"
            : "border-b border-transparent bg-white"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-brand-50 ring-1 ring-brand-200">
              <Image
                src="/images/diamond-green.png"
                alt="CHUTTE LIVE diamond logo"
                fill
                sizes="40px"
                className="diamond-img object-contain p-1"
                priority
              />
            </span>
            <span className="leading-none">
              <span className="block font-display text-[15px] font-extrabold tracking-tight text-ink sm:text-[17px]">
                CHUTTE <span className="text-brand-600">LIVE</span>
              </span>
              <span className="mt-0.5 block font-display text-[8.5px] font-semibold uppercase tracking-[0.26em] text-ink-muted">
                Diamond Store
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3.5 py-2 font-display text-[13px] font-semibold text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="pill-green hidden items-center gap-1.5 rounded-full px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-wider xl:flex">
              <ShieldCheck className="h-3.5 w-3.5" /> 100% Secure
            </span>
            <Link
              href="/#topup"
              className="btn-primary hidden rounded-xl px-5 py-2.5 text-[13px] font-bold sm:inline-flex"
            >
              Top Up Now
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-ink-soft transition-colors hover:border-brand-300 hover:text-brand-600 lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-line bg-white lg:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3">
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 font-display text-sm font-semibold text-ink-soft transition-colors hover:bg-brand-50 hover:text-brand-700"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/#topup"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 rounded-xl py-3 text-center text-sm font-bold"
              >
                Top Up Now
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
