import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { loadUserBundle } from "@/lib/user-data";
import type { StockCard } from "@/types/card";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const body = await request.json();
  const card = body.card as StockCard | undefined;
  if (!card?.ticker) {
    return NextResponse.json({ error: "Card required" }, { status: 400 });
  }

  const ticker = card.ticker.toUpperCase();

  await prisma.watchlistItem.upsert({
    where: { userId_ticker: { userId: user.id, ticker } },
    create: { userId: user.id, ticker, cardJson: JSON.stringify(card) },
    update: { cardJson: JSON.stringify(card) },
  });

  const bundle = await loadUserBundle(user.id);
  return NextResponse.json({ user: bundle });
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker")?.toUpperCase();
  if (!ticker) {
    return NextResponse.json({ error: "Ticker required" }, { status: 400 });
  }

  await prisma.watchlistItem.deleteMany({
    where: { userId: user.id, ticker },
  });

  const bundle = await loadUserBundle(user.id);
  return NextResponse.json({ user: bundle });
}