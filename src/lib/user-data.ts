import "server-only";

import { holdingFromDb, parseCardJson } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { computeTotalFunds } from "@/lib/net-worth";
import type { UserBundle } from "@/types/user";

export type { UserBundle };

export async function loadUserBundle(userId: string): Promise<UserBundle> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    include: {
      holdings: true,
      watchlist: true,
      lessonProgress: { orderBy: { completedAt: "asc" } },
    },
  });

  const holdings = user.holdings.map((h) =>
    holdingFromDb(h.ticker, h.quantity, h.cardJson)
  );
  const watchlist = user.watchlist.map((w) => parseCardJson(w.cardJson));

  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    cashBalance: user.cashBalance,
    xp: user.xp,
    holdings,
    watchlist,
    completedLessons: user.lessonProgress.map((p) => p.lessonId),
    lessonProgress: user.lessonProgress.map((p) => ({
      lessonId: p.lessonId,
      wrongCount: p.wrongCount,
      completedAt: p.completedAt.toISOString(),
    })),
    totalFunds: computeTotalFunds(user.cashBalance, holdings),
  };
}

export async function getLeaderboardRows(userIds?: string[]) {
  const users = await prisma.user.findMany({
    where: userIds ? { id: { in: userIds } } : undefined,
    include: { holdings: true },
    orderBy: { displayName: "asc" },
  });

  const rows = users.map((user) => {
    const holdings = user.holdings.map((h) =>
      holdingFromDb(h.ticker, h.quantity, h.cardJson)
    );
    const portfolioValue = holdings.reduce((s, h) => s + h.price * h.quantity, 0);
    const totalFunds = user.cashBalance + portfolioValue;
    return {
      userId: user.id,
      displayName: user.displayName,
      cashBalance: user.cashBalance,
      portfolioValue,
      totalFunds,
      xp: user.xp,
      holdingsCount: holdings.length,
    };
  });

  return rows.sort((a, b) => b.totalFunds - a.totalFunds);
}