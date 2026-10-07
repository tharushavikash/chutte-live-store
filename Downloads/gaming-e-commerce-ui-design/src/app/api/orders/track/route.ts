import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ref = (searchParams.get("ref") ?? "").trim().toUpperCase();
  if (!ref) {
    return Response.json({ ok: false, error: "Order reference required" }, { status: 400 });
  }
  const [order] = await db.select().from(orders).where(eq(orders.orderRef, ref));
  if (!order) {
    return Response.json({ ok: false, error: "Order not found" }, { status: 404 });
  }
  return Response.json({
    ok: true,
    order: {
      orderRef: order.orderRef,
      playerId: `${order.playerId.slice(0, 2)}***${order.playerId.slice(-2)}`,
      itemName: order.itemName, // මෙතැන diamonds වෙනුවට itemName යොදන්න
      price: Number(order.price),
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      updatedAt: order.updatedAt.toISOString(),
    },
  });
}
