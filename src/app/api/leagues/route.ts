import { NextResponse } from "next/server";
import { generateInviteCode, getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const memberships = await prisma.leagueMember.findMany({
    where: { userId: user.id },
    include: {
      league: {
        include: {
          createdBy: { select: { displayName: true } },
          _count: { select: { members: true } },
        },
      },
    },
    orderBy: { joinedAt: "desc" },
  });

  const leagues = memberships.map((m) => ({
    id: m.league.id,
    name: m.league.name,
    inviteCode: m.league.inviteCode,
    createdBy: m.league.createdBy.displayName,
    memberCount: m.league._count.members,
    joinedAt: m.joinedAt.toISOString(),
  }));

  return NextResponse.json({ leagues });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const body = await request.json();
  const name = String(body.name ?? "").trim() || `${user.displayName}'s League`;

  let inviteCode = generateInviteCode();
  for (let attempt = 0; attempt < 5; attempt++) {
    const exists = await prisma.league.findUnique({ where: { inviteCode } });
    if (!exists) break;
    inviteCode = generateInviteCode();
  }

  const league = await prisma.league.create({
    data: {
      name,
      inviteCode,
      createdById: user.id,
      members: { create: { userId: user.id } },
    },
  });

  return NextResponse.json({
    league: {
      id: league.id,
      name: league.name,
      inviteCode: league.inviteCode,
      memberCount: 1,
    },
  });
}