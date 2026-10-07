import { cookies } from "next/headers";
import { adminPassword, signSession, ADMIN_COOKIE } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { password?: string };
    if (!body.password || body.password !== adminPassword()) {
      return Response.json(
        { ok: false, error: "Invalid admin password." },
        { status: 401 }
      );
    }
    const store = await cookies();
    store.set(ADMIN_COOKIE, signSession(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 12 * 60 * 60,
    });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: "Login failed" }, { status: 500 });
  }
}
