import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "cl_admin";
const SESSION_HOURS = 12;

function secret(): string {
  return process.env.ADMIN_SECRET || "chutte-live-dev-secret-key";
}

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "chutte2024";
}

export function signSession(): string {
  const exp = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const sig = crypto
    .createHmac("sha256", secret())
    .update(String(exp))
    .digest("hex");
  return `${exp}.${sig}`;
}

export function verifySession(token?: string | null): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const expStr = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto
    .createHmac("sha256", secret())
    .update(expStr)
    .digest("hex");
  if (sig.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return false;
  }
  return Number(expStr) > Date.now();
}

/** Check the admin session from server components / route handlers. */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySession(store.get(ADMIN_COOKIE)?.value);
}
