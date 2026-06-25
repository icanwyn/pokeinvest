import type { PortfolioHolding, StockCard } from "@/types/card";

export interface UserLessonProgress {
  lessonId: string;
  wrongCount: number;
  completedAt: string;
}

export interface UserBundle {
  id: string;
  email: string;
  displayName: string;
  cashBalance: number;
  xp: number;
  holdings: PortfolioHolding[];
  watchlist: StockCard[];
  completedLessons: string[];
  lessonProgress: UserLessonProgress[];
  totalFunds: number;
}