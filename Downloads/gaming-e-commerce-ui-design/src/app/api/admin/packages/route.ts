import { db } from "@/db";
import { packages } from "@/db/schema";
import { asc } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const rows = await db.select().from(packages).orderBy(asc(packages.sortOrder), asc(packages.id));
  return Response.json({
    packages: rows.map((p) => ({ ...p, price: Number(p.price) })),
  });
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json()) as {
      diamonds?: number;
      price?: number;
      bonus?: number;
      label?: string | null;
      isPopular?: boolean;
      isActive?: boolean;
      sortOrder?: number;
    };
    const diamonds = Number(body.diamonds);
    const price = Number(body.price);
    if (!Number.isFinite(diamonds) || diamonds <= 0 || !Number.isFinite(price) || price <= 0) {
      return Response.json(
        { ok: false, error: "Diamonds and price must be positive numbers." },
        { status: 400 }
      );
    }
    const [row] = await db
      .insert(packages)
      .values({
        diamonds,
        price: price.toFixed(2),
        bonus: Math.max(0, Math.floor(Number(body.bonus) || 0)),
        label: body.label?.trim() || null,
        isPopular: Boolean(body.isPopular),
        isActive: body.isActive !== false,
        sortOrder: Math.floor(Number(body.sortOrder) || 99),
      })
      .returning();
    return Response.json({ ok: true, package: { ...row, price: Number(row.price) } });
  } catch (err) {
    console.error("Create package failed", err);
    return Response.json({ ok: false, error: "Create failed" }, { status: 500 });
  }
}
