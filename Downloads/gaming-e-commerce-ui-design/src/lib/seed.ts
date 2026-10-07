import { db } from "@/db";
import { packages, paymentMethods, orders } from "@/db/schema";
import { count } from "drizzle-orm";

const PACKAGE_SEED = [
  { diamonds: 115, price: "350", bonus: 0, label: "Starter", isPopular: false, sortOrder: 1 },
  { diamonds: 240, price: "700", bonus: 12, label: null, isPopular: false, sortOrder: 2 },
  { diamonds: 505, price: "1450", bonus: 25, label: "Best Value", isPopular: true, sortOrder: 3 },
  { diamonds: 1090, price: "2900", bonus: 60, label: null, isPopular: false, sortOrder: 4 },
  { diamonds: 2240, price: "5600", bonus: 150, label: "Pro Pack", isPopular: false, sortOrder: 5 },
  { diamonds: 5600, price: "14000", bonus: 500, label: "Ultimate", isPopular: false, sortOrder: 6 },
];

const METHOD_SEED = [
  { name: "Bank Transfer", type: "bank", instructions: "Transfer to our BOC / Commercial Bank account and submit the reference.", sortOrder: 1 },
  { name: "PayHere", type: "payhere", instructions: "Pay securely with PayHere gateway — cards, e-wallets & FRiMi supported.", sortOrder: 2 },
  { name: "Visa", type: "visa", instructions: "Pay with any Visa debit / credit card via secure checkout.", sortOrder: 3 },
  { name: "Mastercard", type: "mastercard", instructions: "Pay with any Mastercard debit / credit card via secure checkout.", sortOrder: 4 },
  { name: "EzCash", type: "ezcash", instructions: "Pay from your Dialog EzCash mobile wallet in seconds.", sortOrder: 5 },
];

const SAMPLE_PLAYERS = [
  "521940388", "874120965", "139885201", "664092174", "308771254",
  "912665430", "248091337", "557210896", "773320641", "102456982",
  "690124578", "435881207",
];

function ref(i: number): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let j = 0; j < 6; j++) s += chars[Math.floor(Math.random() * chars.length)];
  return `CL-${s}${i.toString(36).toUpperCase()}`;
}

let seedPromise: Promise<void> | null = null;

/** Lazily seed the database the first time it is queried. Safe to call often. */
export async function ensureSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = (async () => {
      const [pkgCount] = await db.select({ n: count() }).from(packages);
      if (Number(pkgCount.n) === 0) {
        await db.insert(packages).values(PACKAGE_SEED);
      }
      const [methodCount] = await db.select({ n: count() }).from(paymentMethods);
      if (Number(methodCount.n) === 0) {
        await db.insert(paymentMethods).values(METHOD_SEED);
      }
      const [orderCount] = await db.select({ n: count() }).from(orders);
      if (Number(orderCount.n) === 0) {
        const pkgs = PACKAGE_SEED;
        const methods = METHOD_SEED.map((m) => m.name);
        const statuses = ["completed", "completed", "completed", "processing", "pending", "completed", "completed", "cancelled", "completed", "processing", "completed", "pending"];
        const now = Date.now();
        const rows = SAMPLE_PLAYERS.map((playerId, i) => {
          const p = pkgs[i % pkgs.length];
          const minutesAgo = Math.floor(Math.random() * 90) + i * 7;
          return {
            orderRef: ref(i),
            playerId,
            packageId: null,
            diamonds: p.diamonds,
            price: p.price,
            paymentMethod: methods[i % methods.length],
            status: statuses[i % statuses.length],
            createdAt: new Date(now - minutesAgo * 60000),
            updatedAt: new Date(now - minutesAgo * 60000),
          };
        });
        await db.insert(orders).values(rows);
      }
    })().catch((err) => {
      seedPromise = null;
      throw err;
    });
  }
  return seedPromise;
}
