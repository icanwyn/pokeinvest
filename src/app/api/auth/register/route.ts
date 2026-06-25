import { NextResponse } from "next/server";
import { createSession, registerUser, setSessionCookie } from "@/lib/auth";
import { loadUserBundle } from "@/lib/user-data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "");
    const password = String(body.password ?? "");
    const displayName = String(body.displayName ?? "");

    if (!email || password.length < 6) {
      return NextResponse.json(
        { error: "Email and password (6+ chars) required" },
        { status: 400 }
      );
    }

    const user = await registerUser(email, password, displayName);
    const token = await createSession(user.id);
    await setSessionCookie(token);
    const bundle = await loadUserBundle(user.id);

    return NextResponse.json({ user: bundle });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}