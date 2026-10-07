import { db } from "@/db";
import { packages } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureSeeded();
  const rows = await db
    .select()
    .from(packages)
    .where(eq(packages.isActive, true))
    .orderBy(asc(packages.sortOrder), asc(packages.id));
  return Response.json({
    packages: rows.map((p) => ({ ...p, price: Number(p.price) })),
  });
}
