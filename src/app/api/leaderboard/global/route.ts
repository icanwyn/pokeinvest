import { NextResponse } from "next/server";
import { getLeaderboardRows } from "@/lib/user-data";

export async function GET() {
  const rows = await getLeaderboardRows();
  return NextResponse.json({ leaderboard: rows.slice(0, 10) });
}