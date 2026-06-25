import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const body = await request.json();
  const inviteCode = String(body.inviteCode ?? "").trim().toUpperCase();

  if (!inviteCode) {
    return NextResponse.json({ error: "Invite code required" }, { status: 400 });
  }

  const league = await prisma.league.findUnique({ where: { inviteCode } });
  if (!league) {
    return NextResponse.json({ error: "Invalid invite code" }, { status: 404 });
  }

  await prisma.leagueMember.upsert({
    where: { leagueId_userId: { leagueId: league.id, userId: user.id } },
    create: { leagueId: league.id, userId: user.id },
    update: {},
  });

  const memberCount = await prisma.leagueMember.count({ where: { leagueId: league.id } });

  return NextResponse.json({
    league: {
      id: league.id,
      name: league.name,
      inviteCode: league.inviteCode,
      memberCount,
    },
  });
}