import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdmin } from "@/lib/auth";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const orderId = Number(id);
  if (!Number.isFinite(orderId)) {
    return Response.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }
  const body = (await req.json()) as { status?: string };
  const status = body.status as OrderStatus | undefined;
  if (!status || !ORDER_STATUSES.includes(status)) {
    return Response.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }
  const [updated] = await db
    .update(orders)
    .set({ status, updatedAt: new Date() })
    .where(eq(orders.id, orderId))
    .returning();
  if (!updated) {
    return Response.json({ ok: false, error: "Order not found" }, { status: 404 });
  }
  return Response.json({ ok: true, order: { id: updated.id, status: updated.status } });
}
