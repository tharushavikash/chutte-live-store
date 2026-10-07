import { db } from "@/db";
import { packages } from "@/db/schema";
import { asc } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";
import PackagesManager from "@/components/admin/PackagesManager";

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(packages)
    .orderBy(asc(packages.sortOrder), asc(packages.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black tracking-tight text-white">PACKAGES</h1>
        <p className="mt-1 text-xs text-emerald-100/50">
          Control the diamond packs customers see in the store.
        </p>
      </div>
      <PackagesManager
        packages={rows.map((p) => ({
          id: p.id,
          diamonds: p.diamonds,
          price: Number(p.price),
          bonus: p.bonus,
          label: p.label,
          isPopular: p.isPopular,
          isActive: p.isActive,
          sortOrder: p.sortOrder,
        }))}
      />
    </div>
  );
}
