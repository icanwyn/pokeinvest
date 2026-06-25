import type { PortfolioHolding } from "@/types/card";

export function computeHoldingsValue(holdings: PortfolioHolding[]): number {
  return holdings.reduce((sum, h) => sum + h.price * h.quantity, 0);
}

export function computeTotalFunds(cash: number, holdings: PortfolioHolding[]): number {
  return cash + computeHoldingsValue(holdings);
}