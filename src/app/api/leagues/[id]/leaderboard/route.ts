import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getLeaderboardRows } from "@/lib/user-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { id } = await params;

  const membership = await prisma.leagueMember.findUnique({
    where: { leagueId_userId: { leagueId: id, userId: user.id } },
  });

  if (!membership) {
    return NextResponse.json({ error: "Not a member of this league" }, { status: 403 });
  }

  const members = await prisma.leagueMember.findMany({
    where: { leagueId: id },
    select: { userId: true },
  });

  const rows = await getLeaderboardRows(members.map((m) => m.userId));
  const league = await prisma.league.findUniqueOrThrow({ where: { id } });

  return NextResponse.json({
    league: { id: league.id, name: league.name, inviteCode: league.inviteCode },
    leaderboard: rows,
  });
}