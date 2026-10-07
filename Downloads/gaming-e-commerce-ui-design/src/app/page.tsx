import Image from "next/image";
import { db } from "@/db";
import { orders, packages, paymentMethods } from "@/db/schema";
import { asc, desc, eq, inArray, count } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import LiveTicker from "@/components/site/LiveTicker";
import TopUpWidget from "@/components/site/TopUpWidget";
import Faq from "@/components/site/Faq";
import { orders, packages, paymentMethods, memberships } from "@/db/schema";
import {
  User,
  Gem,
  CreditCard,
  Landmark,
  Wallet,
  Smartphone,
  Zap,
  ShieldCheck,
  Clock,
  Headset,
  Building2,
  BadgeCheck,
  Lock,
  Star,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

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

export default async function Home() {
  await ensureSeeded();

  // 2. Home() function එක ඇතුලේ ඇති Promise.all කොටස මේ ආකාරයට සම්පූර්ණයෙන්ම වෙනස් කරන්න:
  const [pkgs, mems, methods, recent, completedAgg] = await Promise.all([
    db.select().from(packages).where(eq(packages.isActive, true)).orderBy(asc(packages.sortOrder), asc(packages.id)),
    db.select().from(memberships).where(eq(memberships.isActive, true)).orderBy(asc(memberships.sortOrder), asc(memberships.id)),
    db.select().from(paymentMethods).where(eq(paymentMethods.isActive, true)).orderBy(asc(paymentMethods.sortOrder)),
    db.select().from(orders).where(inArray(orders.status, ["completed", "processing"])).orderBy(desc(orders.createdAt)).limit(10),
    db.select({ n: count() }).from(orders).where(eq(orders.status, "completed")),
  ]);

  const delivered = 48210 + Number(completedAgg[0]?.n ?? 0);

  const whyChoose = [
    {
      icon: Zap,
      title: "Instant Delivery in Seconds",
      desc: "Diamonds arrive automatically in your game account as soon as payment is confirmed — 24 hours a day, including holidays.",
    },
    {
      icon: Building2,
      title: "Registered Sri Lankan Business",
      desc: "CHUTTE LIVE is a registered business in Sri Lanka. Thousands of gamers trust us for safe, legitimate diamond top-ups.",
    },
    {
      icon: Lock,
      title: "No Password Required",
      desc: "We only need your public Player UID. We never ask for your password, email or login credentials — your account stays yours.",
    },
    {
      icon: Headset,
      title: "24/7 Human Support",
      desc: "Real people on WhatsApp around the clock. Average first reply under 4 minutes, even on weekends and public holidays.",
    },
    {
      icon: BadgeCheck,
      title: "Cheapest Rates in Sri Lanka",
      desc: "Official top-up rates with bonus diamonds on larger packs. No hidden fees, no inflated pricing, no surprises at checkout.",
    },
    {
      icon: ShieldCheck,
      title: "Bank-Grade Secure Payments",
      desc: "Every transaction is processed over encrypted connections through trusted LKR gateways — PayHere, Visa, Mastercard & EzCash.",
    },
  ];

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero delivered={delivered} />
        <LiveTicker
          entries={recent.map((o) => ({
            playerId: o.playerId,
            diamonds: o.diamonds,
            price: o.price,
            createdAt: o.createdAt.toISOString(),
          }))}
        />

        {/* ---------------- TOP-UP WIDGET ---------------- */}
        <section className="relative overflow-hidden bg-white">
          <div className="mesh-bg pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
            <div className="mx-auto mb-9 max-w-2xl text-center">
              <span className="pill-green inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-[10.5px] font-bold uppercase tracking-[0.14em]">
                <Zap className="h-3.5 w-3.5" /> Instant top-up station
              </span>
              <h2 className="mt-4 font-display text-[26px] font-extrabold tracking-tight text-ink sm:text-4xl">
                Power up in <span className="text-gradient-brand">3 easy steps</span>
              </h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft sm:text-base">
                No account needed. Enter your UID, grab a diamond pack and pay — your vault
                gets refilled before your squad finishes loading.
              </p>
            </div>
          // 3. එම ෆයිල් එකේ පහළින් ඇති <TopUpWidget /> කොටසට memberships එකතු කරන්න:
<TopUpWidget
  packages={pkgs.map((p) => ({
    id: p.id,
    diamonds: p.diamonds,
    price: Number(p.price),
    bonus: p.bonus,
    label: p.label,
    isPopular: p.isPopular,
  }))}
  memberships={mems.map((m) => ({
    id: m.id,
    name: m.name,
    price: Number(m.price),
    diamondsTotal: m.diamondsTotal,
    label: m.label,
  }))}
  methods={methods.map((m) => ({
    id: m.id,
    name: m.name,
    type: m.type,
    instructions: m.instructions,
  }))}
/>
          </div>
        </section>

        {/* ---------------- WHY CHOOSE ---------------- */}
        <section id="why" className="scroll-mt-28 border-y border-line bg-canvas-2">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="pill-green inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-[10.5px] font-bold uppercase tracking-[0.14em]">
                <Star className="h-3.5 w-3.5" /> Trusted by gamers
              </span>
              <h2 className="mt-4 font-display text-[26px] font-extrabold tracking-tight text-ink sm:text-4xl">
                Why choose <span className="text-gradient-brand">CHUTTE LIVE?</span>
              </h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft sm:text-base">
                We&apos;re built for speed, safety and honest pricing — the three things that
                actually matter when you&apos;re topping up.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {whyChoose.map((c) => (
                <div key={c.title} className="soft-card-lift rounded-2xl p-6">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                    <c.icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-[15.5px] font-extrabold text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- PAYMENTS ---------------- */}
        <section id="payments" className="scroll-mt-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="pill-green inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-[10.5px] font-bold uppercase tracking-[0.14em]">
                <ShieldCheck className="h-3.5 w-3.5" /> Trusted checkout
              </span>
              <h2 className="mt-4 font-display text-[26px] font-extrabold tracking-tight text-ink sm:text-4xl">
                Pay your <span className="text-gradient-brand">way</span>
              </h2>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft sm:text-base">
                Five battle-tested payment channels, all encrypted, all processed instantly in
                LKR.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {methods.map((m) => {
                const Icon = payIcon(m.type);
                return (
                  <div key={m.id} className="soft-card-lift rounded-2xl p-5 text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div className="mt-3 font-display text-[13px] font-extrabold text-ink">
                      {m.name}
                    </div>
                    <p className="mt-1.5 text-[11.5px] leading-relaxed text-ink-muted">
                      {m.instructions}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---------------- HOW IT WORKS ---------------- */}
        <section className="border-y border-line bg-canvas-2">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="pill-green inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-[10.5px] font-bold uppercase tracking-[0.14em]">
                <Clock className="h-3.5 w-3.5" /> Lightning process
              </span>
              <h2 className="mt-4 font-display text-[26px] font-extrabold tracking-tight text-ink sm:text-4xl">
                From UID to <span className="text-gradient-brand">diamonds</span> in minutes
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  icon: User,
                  step: "01",
                  title: "Drop your UID",
                  desc: "Type your Free Fire Player UID — no password, no login, ever. Your UID only tells us where to deliver.",
                },
                {
                  icon: Gem,
                  step: "02",
                  title: "Pick your pack",
                  desc: "Choose from 115 to 5,600 diamonds at official rates, with bonus gems included on bigger packs.",
                },
                {
                  icon: CreditCard,
                  step: "03",
                  title: "Pay & watch it land",
                  desc: "Check out with your favourite payment method. Diamonds hit your vault in seconds, 24/7.",
                },
              ].map((s, i) => (
                <div key={s.step} className="relative">
                  <div className="soft-card-lift h-full rounded-2xl p-6">
                    <div className="flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white shadow-[0_6px_16px_-6px_rgba(3,152,85,0.6)]">
                        <s.icon className="h-6 w-6" />
                      </span>
                      <span className="font-display text-3xl font-extrabold text-brand-100">
                        {s.step}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-[15.5px] font-extrabold text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{s.desc}</p>
                  </div>
                  {i < 2 && (
                    <ArrowRight className="absolute -right-3.5 top-1/2 z-10 hidden h-5 w-5 -translate-y-1/2 text-brand-400 md:block" />
                  )}
                </div>
              ))}
            </div>

            <div className="soft-card mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl p-6 sm:flex-row">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 ring-1 ring-brand-100">
                  <Headset className="h-6 w-6" />
                </span>
                <div>
                  <div className="font-display text-[14.5px] font-extrabold text-ink">
                    Stuck anywhere? Our squad is awake.
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[12.5px] text-ink-soft">
                    <Clock className="h-3.5 w-3.5 text-brand-600" /> 24/7 support — average reply
                    under 4 minutes.
                  </div>
                </div>
              </div>
              <a
                href="#topup"
                className="btn-primary w-full rounded-xl px-6 py-3 text-center text-[12.5px] font-extrabold uppercase sm:w-auto"
              >
                Start Top-Up
              </a>
            </div>
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section id="faq" className="scroll-mt-28 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="pill-green inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-display text-[10.5px] font-bold uppercase tracking-[0.14em]">
                <ShieldCheck className="h-3.5 w-3.5" /> Intel database
              </span>
              <h2 className="mt-4 font-display text-[26px] font-extrabold tracking-tight text-ink sm:text-4xl">
                Frequently asked <span className="text-gradient-brand">questions</span>
              </h2>
            </div>
            <Faq />
          </div>
        </section>
      </main>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="border-t border-line bg-canvas-2">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
            <div className="max-w-sm">
              <div className="flex items-center gap-2.5">
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
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-ink-soft">
                Sri Lanka&apos;s fastest Free Fire diamond top-up store. Instant automated
                delivery, official rates and bank-grade security — powered by gamers, for
                gamers.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["24/7 Instant", "100% Secure", "Registered Business"].map((b) => (
                  <span
                    key={b}
                    className="pill-green rounded-full px-3 py-1.5 font-display text-[10px] font-bold uppercase tracking-wider"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="font-display text-[10.5px] font-bold uppercase tracking-[0.2em] text-ink">
                Store
              </div>
              <ul className="mt-4 space-y-2.5 text-[13px] text-ink-soft">
                <li><a href="#topup" className="transition-colors hover:text-brand-700">Top Up Diamonds</a></li>
                <li><a href="#payments" className="transition-colors hover:text-brand-700">Payment Methods</a></li>
                <li><a href="/track" className="transition-colors hover:text-brand-700">Track Order</a></li>
                <li><a href="#faq" className="transition-colors hover:text-brand-700">FAQ</a></li>
              </ul>
            </div>
            <div>
              <div className="font-display text-[10.5px] font-bold uppercase tracking-[0.2em] text-ink">
                Support
              </div>
              <ul className="mt-4 space-y-2.5 text-[13px] text-ink-soft">
                <li><a href="/admin" className="transition-colors hover:text-brand-700">Admin Panel</a></li>
                <li><a href="#faq" className="transition-colors hover:text-brand-700">Help Centre</a></li>
                <li><span>WhatsApp — 24/7</span></li>
                <li><span>Live drops feed</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-line pt-6 text-[11.5px] text-ink-muted sm:flex-row">
            <span>© {new Date().getFullYear()} CHUTTE LIVE Diamond Store. All rights reserved.</span>
            <span>Not affiliated with Garena Free Fire. Diamonds delivered via official top-up API.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
