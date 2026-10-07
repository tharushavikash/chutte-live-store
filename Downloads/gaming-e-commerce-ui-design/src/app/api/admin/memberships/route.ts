import { db } from "@/db";
import { memberships } from "@/db/schema";
import { asc } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db.select().from(memberships).orderBy(asc(memberships.sortOrder), asc(memberships.id));
  return Response.json({ memberships: rows.map((m) => ({ ...m, price: Number(m.price) })) });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as any;
    const price = Number(body.price);
    const diamondsTotal = Number(body.diamondsTotal);

    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(diamondsTotal) || diamondsTotal <= 0) {
      return Response.json({ ok: false, error: "Price and total diamonds must be positive numbers." }, { status: 400 });
    }

    const [row] = await db
      .insert(memberships)
      .values({
        name: body.name.trim(),
        price: price.toFixed(2),
        diamondsTotal: Math.floor(diamondsTotal),
        label: body.label?.trim() || null,
        isActive: body.isActive !== false,
        sortOrder: Math.floor(Number(body.sortOrder) || 99),
      })
      .returning();

    return Response.json({ ok: true, membership: { ...row, price: Number(row.price) } });
  } catch (err) {
    return Response.json({ ok: false, error: "Create failed" }, { status: 500 });
  }
}