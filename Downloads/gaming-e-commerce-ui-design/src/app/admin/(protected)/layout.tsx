import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
  return (
    <div className="min-h-screen bg-canvas-2">
      <div className="relative lg:pl-60">
        <AdminNav />
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
