import type { CardStat, StockCard } from "@/types/card";

export interface RawFundamentals {
  peRatio: number | null;
  eps: number | null;
  revenueGrowth: number | null;
  profitMargin: number | null;
  debtToEquity: number | null;
  dividendYield: number | null;
  beta: number | null;
  roe: number | null;
  currentRatio: number | null;
  freeCashFlow: number | null;
}

export interface HealthHpResult {
  hp: number;
  note: string;
}

/** Pokémon-style HP: higher = sturdier company (liquidity, profits, manageable debt). */
export function computeHealthHp(data: RawFundamentals): HealthHpResult {
  let score = 90;

  if (data.currentRatio !== null) {
    // ~1.0 = can pay bills; 2.0+ = strong cash cushion
    score = 35 + Math.min(data.currentRatio, 3) * 45;
  }

  if (data.profitMargin !== null) {
    if (data.profitMargin < 0) score -= 25;
    else score += Math.min(data.profitMargin * 100, 30) * 0.5;
  }

  if (data.debtToEquity !== null) {
    score -= Math.min(data.debtToEquity * 12, 45);
  }

  const hp = Math.round(Math.max(30, Math.min(200, score)));

  let note =
    "HP is financial stamina — cash to pay bills, profits, and debt you can handle.";
  if (data.currentRatio !== null && data.currentRatio < 1) {
    note = "Tight short-term cash — like low HP heading into a tough battle.";
  } else if (data.debtToEquity !== null && data.debtToEquity > 2) {
    note = "Heavy debt load — strong Attack but thin Defense can drain HP fast.";
  } else if (hp >= 150) {
    note = "Sturdy balance sheet — this company can take a few hits.";
  }

  return { hp, note };
}

export function resolveDisplayHealthHp(
  card: Pick<StockCard, "healthHp" | "balanceSheet">
): number | "—" {
  if (typeof card.healthHp === "number") return card.healthHp;

  const cr = card.balanceSheet?.currentRatio;
  if (cr && cr > 0) {
    return Math.round(Math.max(30, Math.min(200, 35 + Math.min(cr, 3) * 45)));
  }

  return "—";
}

export function buildCardStats(data: RawFundamentals): CardStat[] {
  return [
    {
      label: "TKT",
      value: data.peRatio ?? "—",
      max: 50,
      pokemonMetaphor: "Ticket Price (P/E)",
      kidExplanation:
        "P/E is the ticket price for one dollar of earnings — like Poké Dollars per profit point. Lower can be a bargain seat; higher means the crowd expects big growth!",
    },
    {
      label: "ATK",
      value: data.revenueGrowth !== null ? `${data.revenueGrowth.toFixed(1)}%` : "—",
      max: 100,
      pokemonMetaphor: "Attack (Revenue Growth)",
      kidExplanation:
        "Revenue growth is the company's Attack stat — how hard it's hitting the market and growing sales!",
    },
    {
      label: "DEF",
      value: data.debtToEquity !== null ? data.debtToEquity.toFixed(2) : "—",
      max: 3,
      pokemonMetaphor: "Defense (Debt/Equity)",
      kidExplanation:
        "Debt-to-equity is Defense — how well the company can protect itself. Too much debt is like low defense!",
    },
    {
      label: "SPD",
      value: data.beta !== null ? data.beta.toFixed(2) : "—",
      max: 3,
      pokemonMetaphor: "Speed (Beta/Volatility)",
      kidExplanation:
        "Beta is Speed — how fast the stock price moves. High beta = wild rides like a Speedster Pokémon!",
    },
    {
      label: "SPC",
      value: data.roe !== null ? `${(data.roe * 100).toFixed(1)}%` : "—",
      max: 50,
      pokemonMetaphor: "Special (Return on Equity)",
      kidExplanation:
        "ROE is the Special Attack — how cleverly the company turns money into more money!",
    },
    {
      label: "ACC",
      value: data.profitMargin !== null ? `${(data.profitMargin * 100).toFixed(1)}%` : "—",
      max: 50,
      pokemonMetaphor: "Accuracy (Profit Margin)",
      kidExplanation:
        "Profit margin is Accuracy — what percentage of sales actually becomes profit. Higher = more precise!",
    },
  ];
}

export const HEALTH_HP_EXPLANATION =
  "HP on the card header is company health — higher means sturdier, like a Pokémon with lots of hit points. It blends cash cushion, profits, and debt load.";

export const TKT_EXPLANATION =
  "TKT is the P/E ratio — how many dollars you pay for one dollar of yearly earnings. Like a ticket price: lower can be a bargain seat; higher means big growth expectations.";

/** TKT on new cards; PWR on cards cached before the rename. */
export function findPeStat(stats: CardStat[]): CardStat | undefined {
  return stats.find((s) => s.label === "TKT" || s.label === "PWR");
}

export function formatPeDisplay(value: string | number): string {
  if (value === "—") return "—";
  const n = typeof value === "number" ? value : parseFloat(String(value));
  if (Number.isNaN(n)) return String(value);
  return `${n.toFixed(n >= 10 ? 0 : 1)}×`;
}