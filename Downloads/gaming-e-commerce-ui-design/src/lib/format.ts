export function formatRs(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  return `Rs. ${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function maskPlayerId(id: string): string {
  if (id.length <= 4) return `${id.slice(0, 1)}***`;
  return `${id.slice(0, 2)}***${id.slice(-2)}`;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} d ago`;
}

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "completed",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
