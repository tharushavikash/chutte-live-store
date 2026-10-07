import { db } from "@/db";
import { orders, packages, paymentMethods } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

function generateRef(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 8; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return `CL-${s}`;
}

export async function POST(req: Request) {
  try {
    await ensureSeeded();
    const body = (await req.json()) as {
      playerId?: string;
      packageId?: number;
      paymentMethod?: string;
    };

    const playerId = (body.playerId ?? "").trim();
    if (!/^\d{6,12}$/.test(playerId)) {
      return Response.json(
        { ok: false, error: "Enter a valid Player UID (6–12 digits)." },
        { status: 400 }
      );
    }

    const packageId = Number(body.packageId);
    const [pkg] = await db
      .select()
      .from(packages)
      .where(and(eq(packages.id, packageId), eq(packages.isActive, true)));
    if (!pkg) {
      return Response.json(
        { ok: false, error: "Please select a diamond package." },
        { status: 400 }
      );
    }

    const methodName = (body.paymentMethod ?? "").trim();
    const [method] = await db
      .select()
      .from(paymentMethods)
      .where(and(eq(paymentMethods.name, methodName), eq(paymentMethods.isActive, true)));
    if (!method) {
      return Response.json(
        { ok: false, error: "Please select a payment method." },
        { status: 400 }
      );
    }

    let orderRef = generateRef();
    for (let i = 0; i < 5; i++) {
      const [existing] = await db
        .select({ id: orders.id })
        .from(orders)
        .where(eq(orders.orderRef, orderRef));
      if (!existing) break;
      orderRef = generateRef();
    }

    const [order] = await db
      .insert(orders)
      .values({
        orderRef,
        playerId,
        packageId: pkg.id,
        diamonds: pkg.diamonds,
        price: pkg.price,
        paymentMethod: method.name,
        status: "pending",
      })
      .returning();

    return Response.json({
      ok: true,
      order: {
        orderRef: order.orderRef,
        playerId: order.playerId,
        diamonds: order.diamonds,
        price: Number(order.price),
        paymentMethod: order.paymentMethod,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      },
    });
  } catch (err) {
    console.error("Create order failed", err);
    return Response.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  if (!(await isAdmin())) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  await ensureSeeded();
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(300);
  return Response.json({
    orders: rows.map((o) => ({
      ...o,
      price: Number(o.price),
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    })),
  });
}
