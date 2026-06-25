import { NextResponse } from "next/server";
import { createSession, loginUser, setSessionCookie } from "@/lib/auth";
import { loadUserBundle } from "@/lib/user-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "");
    const password = String(body.password ?? "");

    const user = await loginUser(email, password);
    const token = await createSession(user.id);
    await setSessionCookie(token);
    const bundle = await loadUserBundle(user.id);

    return NextResponse.json({ user: bundle });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}