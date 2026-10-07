"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Is my Free Fire account safe when topping up?",
    a: "Yes, your account is 100% safe. CHUTTE LIVE only requires your Player UID — we never ask for your password, email, or any login credentials. Your Free Fire account remains completely secure and accessible only to you.",
  },
  {
    q: "How fast is Free Fire diamond delivery?",
    a: "Delivery is fully automated. Free Fire diamonds are delivered directly to your account within 2–5 seconds after payment confirmation — 24 hours a day, 7 days a week, including holidays.",
  },
  {
    q: "Which payment methods are accepted?",
    a: "We accept Bank Transfer, PayHere, Visa, Mastercard, and Dialog EzCash. All payments are processed securely in LKR over encrypted, bank-grade connections.",
  },
  {
    q: "How do I find my Free Fire Player UID?",
    a: "Open Free Fire, tap your profile picture in the top-left corner of the lobby. Your Player UID is the number displayed below your username. Enter that number when topping up — no password is needed.",
  },
  {
    q: "What is the cheapest diamond package available?",
    a: "Our smallest package is 115 Diamonds for Rs. 350. The best value package is 505 Diamonds for Rs. 1,450, which also includes 25 bonus diamonds. All packages include instant automated delivery.",
  },
  {
    q: "What if my diamonds haven't arrived?",
    a: "First check your order status on the Track Order page using your CL- reference. If it shows Completed but nothing is in your vault, restart the game. Still stuck? Contact our 24/7 support with your reference and we'll resolve it within minutes.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={f.q}
            className={`soft-card overflow-hidden rounded-2xl transition-all duration-200 ${
              isOpen ? "border-brand-300 shadow-[0_1px_3px_rgba(16,40,28,0.04),0_16px_36px_-20px_rgba(3,152,85,0.4)]" : ""
            }`}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
              aria-expanded={isOpen}
            >
              <span
                className={`font-display text-[14px] font-bold sm:text-[15px] ${
                  isOpen ? "text-brand-700" : "text-ink"
                }`}
              >
                {f.q}
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                  isOpen ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-600"
                }`}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>
            <div
              className={`grid transition-all duration-200 ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[13.5px] leading-relaxed text-ink-soft sm:px-6 sm:pb-6">
                  {f.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
