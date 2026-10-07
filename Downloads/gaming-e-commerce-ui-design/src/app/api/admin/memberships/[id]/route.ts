import { db } from "@/db";
import { memberships } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  
  const { id } = await params;
  const memId = Number(id);
  if (!Number.isFinite(memId)) return Response.json({ ok: false, error: "Invalid id" }, { status: 400 });

  try {
    const body = await req.json();
    const updates: any = {};
    if (body.name !== undefined) updates.name = body.name.trim();
    if (body.price !== undefined) updates.price = Number(body.price).toFixed(2);
    if (body.diamondsTotal !== undefined) updates.diamondsTotal = Math.floor(Number(body.diamondsTotal));
    if (body.label !== undefined) updates.label = body.label?.trim() || null;
    if (body.isActive !== undefined) updates.isActive = Boolean(body.isActive);
    if (body.sortOrder !== undefined) updates.sortOrder = Math.floor(Number(body.sortOrder) || 99);

    const [row] = await db.update(memberships).set(updates).where(eq(memberships.id, memId)).returning();
    if (!row) return Response.json({ ok: false, error: "Not found" }, { status: 404 });
    return Response.json({ ok: true, membership: { ...row, price: Number(row.price) } });
  } catch (err) {
    return Response.json({ ok: false, error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  
  const { id } = await params;
  const [row] = await db.delete(memberships).where(eq(memberships.id, Number(id))).returning();
  if (!row) return Response.json({ ok: false, error: "Not found" }, { status: 404 });
  return Response.json({ ok: true });
}