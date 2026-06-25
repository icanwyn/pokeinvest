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
  const quantity = Math.max(1, Math.floor(Number(body.quantity) || 1));

  if (!card?.ticker) {
    return NextResponse.json({ error: "Card required" }, { status: 400 });
  }

  const ticker = card.ticker.toUpperCase();
  const cost = card.price * quantity;

  const existing = await prisma.holding.findUnique({
    where: { userId_ticker: { userId: user.id, ticker } },
  });

  if (existing) {
    return NextResponse.json({ error: "Already in portfolio — adjust quantity instead" }, { status: 400 });
  }

  if (user.cashBalance < cost - 1e-9) {
    return NextResponse.json(
      { error: `Not enough cash. Need $${cost.toFixed(2)}, have $${user.cashBalance.toFixed(2)}` },
      { status: 400 }
    );
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { cashBalance: { decrement: cost } },
    }),
    prisma.holding.create({
      data: {
        userId: user.id,
        ticker,
        quantity,
        cardJson: JSON.stringify(card),
      },
    }),
    prisma.watchlistItem.deleteMany({
      where: { userId: user.id, ticker },
    }),
  ]);

  const bundle = await loadUserBundle(user.id);
  return NextResponse.json({ user: bundle });
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const body = await request.json();
  const ticker = String(body.ticker ?? "").toUpperCase();
  const newQuantity = Math.floor(Number(body.quantity));
  const card = body.card as StockCard | undefined;

  if (!ticker || Number.isNaN(newQuantity)) {
    return NextResponse.json({ error: "Ticker and quantity required" }, { status: 400 });
  }

  const holding = await prisma.holding.findUnique({
    where: { userId_ticker: { userId: user.id, ticker } },
  });

  if (!holding) {
    return NextResponse.json({ error: "Holding not found" }, { status: 404 });
  }

  const currentCard = JSON.parse(holding.cardJson) as StockCard;
  const price = card?.price ?? currentCard.price;
  const delta = newQuantity - holding.quantity;

  if (newQuantity <= 0) {
    const proceeds = price * holding.quantity;
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { cashBalance: { increment: proceeds } },
      }),
      prisma.holding.delete({ where: { id: holding.id } }),
    ]);
  } else if (delta > 0) {
    const cost = price * delta;
    if (user.cashBalance < cost - 1e-9) {
      return NextResponse.json({ error: "Not enough cash for additional shares" }, { status: 400 });
    }
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { cashBalance: { decrement: cost } },
      }),
      prisma.holding.update({
        where: { id: holding.id },
        data: {
          quantity: newQuantity,
          cardJson: JSON.stringify(card ?? currentCard),
        },
      }),
    ]);
  } else if (delta < 0) {
    const proceeds = price * Math.abs(delta);
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { cashBalance: { increment: proceeds } },
      }),
      prisma.holding.update({
        where: { id: holding.id },
        data: {
          quantity: newQuantity,
          cardJson: JSON.stringify(card ?? currentCard),
        },
      }),
    ]);
  } else if (card) {
    await prisma.holding.update({
      where: { id: holding.id },
      data: { cardJson: JSON.stringify(card) },
    });
  }

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

  const holding = await prisma.holding.findUnique({
    where: { userId_ticker: { userId: user.id, ticker } },
  });

  if (holding) {
    const card = JSON.parse(holding.cardJson) as StockCard;
    const proceeds = card.price * holding.quantity;
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { cashBalance: { increment: proceeds } },
      }),
      prisma.holding.delete({ where: { id: holding.id } }),
    ]);
  }

  const bundle = await loadUserBundle(user.id);
  return NextResponse.json({ user: bundle });
}