"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Zap, ShieldCheck, Timer, ChevronDown, Star, BadgeCheck } from "lucide-react";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const dur = 1500;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

export default function Hero({ delivered }: { delivered: number }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-canvas-2">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-light.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-canvas-2/80 to-canvas-2" />
        <div className="dot-grid absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-10 px-4 pb-14 pt-12 sm:px-6 sm:pb-16 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-8 lg:pb-20 lg:pt-20 lg:px-8">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 shadow-[0_2px_10px_-4px_rgba(3,152,85,0.3)]"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-brand-500" />
            <span className="font-display text-[10.5px] font-bold uppercase tracking-[0.14em] text-brand-700 sm:text-[11.5px]">
              Sri Lanka&apos;s cheapest Free Fire diamonds
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-5 font-display text-[32px] font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[54px]"
          >
            Free Fire Diamond
            <span className="mt-1 block text-gradient-brand">Top Up Sri Lanka</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:text-lg lg:mx-0"
          >
            Instant &amp; automated delivery to your UID — no password, no login, ever.
            Pay with EzCash, PayHere, Visa, Mastercard or bank transfer and your
            diamonds arrive in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <a
              href="#topup"
              className="btn-primary inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold"
            >
              <Zap className="h-4 w-4" />
              Top Up Now
            </a>
            <Link
              href="/track"
              className="btn-outline inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold"
            >
              <Timer className="h-4 w-4" />
              Track Order
            </Link>
          </motion.div>

          {/* trust row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start"
          >
            <span className="flex items-center gap-2 text-[13px] font-semibold text-ink-soft">
              <ShieldCheck className="h-4.5 w-4.5 text-brand-600" /> 100% Safe &amp; Secure
            </span>
            <span className="flex items-center gap-2 text-[13px] font-semibold text-ink-soft">
              <BadgeCheck className="h-4.5 w-4.5 text-brand-600" /> Registered Business
            </span>
            <span className="flex items-center gap-2 text-[13px] font-semibold text-ink-soft">
              <span className="flex">
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </span>
              4.9 / 5 rating
            </span>
          </motion.div>
        </div>

        {/* diamond visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto hidden h-[380px] w-full max-w-sm lg:block xl:h-[440px]"
        >
          <div className="absolute left-1/2 top-1/2 h-[74%] w-[74%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-200/40 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow rounded-full border-2 border-dashed border-brand-300/50" />
          <div className="absolute inset-0 animate-float">
            <Image
              src="/images/diamond-hero-green.png"
              alt="Free Fire diamond"
              fill
              priority
              sizes="(min-width: 1024px) 420px, 100vw"
              className="object-contain"
            />
          </div>

          <div
            className="soft-card-lift absolute left-[-6%] top-[14%] animate-float-slow rounded-2xl px-4 py-2.5"
            style={{ animationDelay: "0.8s" }}
          >
            <div className="font-display text-[11px] font-extrabold text-brand-700">
              2–5 sec delivery
            </div>
            <div className="text-[10px] text-ink-muted">fully automated</div>
          </div>
          <div
            className="soft-card-lift absolute right-[-8%] bottom-[16%] animate-float-slow rounded-2xl px-4 py-2.5"
            style={{ animationDelay: "1.6s" }}
          >
            <div className="font-display text-[11px] font-extrabold text-brand-700">
              10,000+ orders
            </div>
            <div className="text-[10px] text-ink-muted">happy gamers</div>
          </div>
        </motion.div>
      </div>

      {/* stats strip */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 divide-x divide-line overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_3px_rgba(16,40,28,0.04),0_14px_32px_-20px_rgba(16,40,28,0.2)]">
          {[
            { label: "Orders delivered", value: <CountUp to={delivered} suffix="+" /> },
            { label: "Avg. delivery", value: <CountUp to={45} suffix="s" /> },
            { label: "Open", value: "24/7" },
          ].map((s) => (
            <div key={s.label} className="px-3 py-4 text-center sm:px-6 sm:py-5">
              <div className="font-display text-lg font-extrabold text-brand-700 sm:text-2xl">
                {s.value}
              </div>
              <div className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-ink-muted sm:text-[11px]">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <a
        href="#topup"
        className="absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 text-brand-500 transition-colors hover:text-brand-700 lg:block"
        aria-label="Scroll to top-up"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </a>
    </section>
  );
}
