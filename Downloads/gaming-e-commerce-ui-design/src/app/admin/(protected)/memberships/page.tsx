import { db } from "@/db";
import { memberships } from "@/db/schema";
import { asc } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";
import MembershipsManager from "@/components/admin/MembershipsManager";

export const dynamic = "force-dynamic";

export default async function AdminMembershipsPage() {
  await ensureSeeded();
  const rows = await db.select().from(memberships).orderBy(asc(memberships.sortOrder), asc(memberships.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black tracking-tight text-white">MEMBERSHIPS</h1>
        <p className="mt-1 text-xs text-emerald-100/50">
          Control the weekly and monthly memberships customers see in the store.
        </p>
      </div>
      <MembershipsManager
        memberships={rows.map((m) => ({
          id: m.id,
          name: m.name,
          price: Number(m.price),
          diamondsTotal: m.diamondsTotal,
          label: m.label,
          isActive: m.isActive,
          sortOrder: m.sortOrder,
        }))}
      />
    </div>
  );
}