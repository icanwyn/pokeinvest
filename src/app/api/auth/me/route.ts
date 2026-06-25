import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { loadUserBundle } from "@/lib/user-data";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ user: null });
  }
  const bundle = await loadUserBundle(user.id);
  return NextResponse.json({ user: bundle });
}