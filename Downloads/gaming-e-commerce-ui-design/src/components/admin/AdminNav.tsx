"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, LogOut, ExternalLink, Gem } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/packages", label: "Packages", icon: Package },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-line bg-white lg:flex">
        <div className="flex items-center gap-2.5 border-b border-line px-5 py-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Gem className="h-4.5 w-4.5" />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[13.5px] font-extrabold tracking-tight text-ink">
              CHUTTE <span className="text-brand-600">LIVE</span>
            </span>
            <span className="mt-1 block font-display text-[8px] font-bold uppercase tracking-[0.24em] text-ink-muted">
              Command Center
            </span>
          </span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-5">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-3 font-display text-[12.5px] font-bold transition-all ${
                  active
                    ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                    : "text-ink-soft hover:bg-canvas-2 hover:text-ink"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="space-y-1 border-t border-line px-3 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-display text-[11.5px] font-bold text-ink-soft transition-colors hover:bg-canvas-2 hover:text-brand-700"
          >
            <ExternalLink className="h-4 w-4" /> View Store
          </Link>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 font-display text-[11.5px] font-bold text-danger transition-colors hover:bg-danger/6"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-line bg-white px-4 py-3 lg:hidden">
        <span className="flex items-center gap-2 font-display text-[13px] font-extrabold tracking-tight text-ink">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Gem className="h-3.5 w-3.5" />
          </span>
          Admin
        </span>
        <div className="flex items-center gap-1.5">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                pathname === href
                  ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                  : "text-ink-soft hover:bg-canvas-2"
              }`}
              aria-label={label}
            >
              <Icon className="h-4 w-4" />
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-danger transition-colors hover:bg-danger/6"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </>
  );
}
