import { db } from "@/db";
import { packages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const pkgId = Number(id);
  if (!Number.isFinite(pkgId)) {
    return Response.json({ ok: false, error: "Invalid id" }, { status: 400 });
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
    const updates: Record<string, unknown> = {};
    if (body.diamonds !== undefined) {
      const d = Number(body.diamonds);
      if (!Number.isFinite(d) || d <= 0) throw new Error("bad diamonds");
      updates.diamonds = d;
    }
    if (body.price !== undefined) {
      const p = Number(body.price);
      if (!Number.isFinite(p) || p <= 0) throw new Error("bad price");
      updates.price = p.toFixed(2);
    }
    if (body.bonus !== undefined) updates.bonus = Math.max(0, Math.floor(Number(body.bonus) || 0));
    if (body.label !== undefined) updates.label = body.label?.trim() || null;
    if (body.isPopular !== undefined) updates.isPopular = Boolean(body.isPopular);
    if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive);
    if (body.sortOrder !== undefined) updates.sortOrder = Math.floor(Number(body.sortOrder) || 99);

    if (Object.keys(updates).length === 0) {
      return Response.json({ ok: false, error: "Nothing to update" }, { status: 400 });
    }
    const [row] = await db.update(packages).set(updates).where(eq(packages.id, pkgId)).returning();
    if (!row) {
      return Response.json({ ok: false, error: "Package not found" }, { status: 404 });
    }
    return Response.json({ ok: true, package: { ...row, price: Number(row.price) } });
  } catch (err) {
    console.error("Update package failed", err);
    return Response.json({ ok: false, error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const pkgId = Number(id);
  if (!Number.isFinite(pkgId)) {
    return Response.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }
  const [row] = await db.delete(packages).where(eq(packages.id, pkgId)).returning();
  if (!row) {
    return Response.json({ ok: false, error: "Package not found" }, { status: 404 });
  }
  return Response.json({ ok: true });
}
