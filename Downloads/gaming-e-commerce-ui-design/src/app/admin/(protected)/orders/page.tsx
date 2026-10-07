import { db } from "@/db";
import { orders } from "@/db/schema";
import { desc } from "drizzle-orm";
import { ensureSeeded } from "@/lib/seed";
import OrdersTable from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await ensureSeeded();
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(300);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-black tracking-tight text-white">ORDERS</h1>
        <p className="mt-1 text-xs text-emerald-100/50">
          Search, filter and update order fulfilment status in real time.
        </p>
      </div>
      <OrdersTable
        orders={rows.map((o) => ({
          id: o.id,
          orderRef: o.orderRef,
          playerId: o.playerId,
          diamonds: o.diamonds,
          price: Number(o.price),
          paymentMethod: o.paymentMethod,
          status: o.status,
          createdAt: o.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
