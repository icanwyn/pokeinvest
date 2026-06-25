import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { clearSessionCookie, destroySession } from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("pokeinvest_session")?.value;
  await destroySession(token);
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}