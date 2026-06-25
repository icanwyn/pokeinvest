import "server-only";

import {
  buildCardStats,
  computeHealthHp,
  type RawFundamentals,
} from "@/lib/mappings/fundamentals";
import { getEvolutionStage } from "@/lib/mappings/evolution";
import { getRarityFromMarketCap } from "@/lib/mappings/rarity";
import { getSectorMapping } from "@/lib/mappings/sectors";
import { resolveAvatar } from "@/lib/resolve-avatar";
import type { BalanceSheetSummary, StockCard } from "@/types/card";
import YahooFinance from "yahoo-finance2";

const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

function toNum(value: unknown): number | null {
  return typeof value === "number" && !Number.isNaN(value) ? value : null;
}

function mapSectorToGics(sector: string): string {
  const map: Record<string, string> = {
    Technology: "Information Technology",
    "Consumer Cyclical": "Consumer Discretionary",
    "Consumer Defensive": "Consumer Staples",
    "Basic Materials": "Materials",
    "Communication Services": "Communication Services",
    Healthcare: "Health Care",
    "Financial Services": "Financials",
    "Real Estate": "Real Estate",
    Utilities: "Utilities",
    Energy: "Energy",
    Industrials: "Industrials",
  };
  return map[sector] ?? sector;
}

/** Yahoo uses dashes for class shares (e.g. BRK.B → BRK-B). */
function toYahooSymbol(ticker: string): string {
  return ticker.toUpperCase().trim().replace(/\./g, "-");
}

export async function fetchStockData(ticker: string): Promise<StockCard> {
  const displaySymbol = ticker.toUpperCase().trim();
  const symbol = toYahooSymbol(ticker);

  try {
    const [summary, quote, balanceData] = await Promise.all([
      yahooFinance.quoteSummary(symbol, {
        modules: [
          "summaryProfile",
          "price",
          "financialData",
          "defaultKeyStatistics",
          "summaryDetail",
        ],
      }),
      yahooFinance.quote(symbol),
      yahooFinance.fundamentalsTimeSeries(symbol, {
        period1: "2022-01-01",
        type: "annual",
        module: "balance-sheet",
      }).catch(() => null),
    ]);

    const profile = summary.summaryProfile;
    const price = summary.price;
    const financial = summary.financialData;
    const keyStats = summary.defaultKeyStatistics;
    const detail = summary.summaryDetail;

    const marketCap =
      toNum(keyStats?.marketCap) ??
      toNum(detail?.marketCap) ??
      toNum(quote?.marketCap) ??
      0;

    const revenueGrowth = toNum(financial?.revenueGrowth);

    const fundamentals: RawFundamentals = {
      peRatio: toNum(keyStats?.trailingPE) ?? toNum(keyStats?.forwardPE),
      eps: toNum(keyStats?.trailingEps),
      revenueGrowth: revenueGrowth !== null ? revenueGrowth * 100 : null,
      profitMargin: toNum(financial?.profitMargins),
      debtToEquity: toNum(financial?.debtToEquity),
      dividendYield:
        toNum(detail?.dividendYield) ?? toNum(financial?.dividendYield),
      beta: toNum(keyStats?.beta),
      roe: toNum(financial?.returnOnEquity),
      currentRatio: toNum(financial?.currentRatio),
      freeCashFlow: toNum(financial?.freeCashflow),
    };

    const gicsSector = mapSectorToGics(profile?.sector ?? "");
    const sectorMapping = getSectorMapping(gicsSector);
    const rarity = getRarityFromMarketCap(marketCap);
    const evolution = getEvolutionStage(
      marketCap,
      fundamentals.revenueGrowth,
      null
    );

    const latestBS = Array.isArray(balanceData)
      ? (balanceData[balanceData.length - 1] as Record<string, unknown>)
      : null;

    const balanceSheet: BalanceSheetSummary = {
      totalAssets: toNum(latestBS?.totalAssets) ?? 0,
      totalLiabilities: toNum(latestBS?.totalLiabilitiesNetMinorityInterest) ?? 0,
      totalEquity:
        toNum(latestBS?.totalEquityGrossMinorityInterest) ??
        toNum(latestBS?.commonStockEquity) ??
        0,
      cash: toNum(latestBS?.cashAndCashEquivalents) ?? 0,
      totalDebt: toNum(latestBS?.totalDebt) ?? 0,
      currentRatio: toNum(financial?.currentRatio) ?? 0,
    };

    const dividendYield = fundamentals.dividendYield;
    const specialAbility =
      dividendYield && dividendYield > 0
        ? {
            name: "Dividend Drop",
            description:
              "Pays shareholders cash regularly — like a healing move!",
            value: `${(dividendYield * 100).toFixed(2)}% yield`,
          }
        : undefined;

    const businessSummary = profile?.longBusinessSummary ?? "";
    const description =
      businessSummary.length > 200
        ? businessSummary.slice(0, 197) + "..."
        : businessSummary ||
          `${profile?.longName ?? symbol} — a ${profile?.sector ?? "mystery"} sector company.`;

    const regularPrice =
      toNum(price?.regularMarketPrice) ?? toNum(quote?.regularMarketPrice) ?? 0;
    const priceChange =
      toNum(price?.regularMarketChange) ?? toNum(quote?.regularMarketChange) ?? 0;
    const priceChangePercent =
      (toNum(price?.regularMarketChangePercent) ??
        toNum(quote?.regularMarketChangePercent) ??
        0) * 100;

    const website = profile?.website;
    const avatar = resolveAvatar(displaySymbol, sectorMapping.pokemonType, website);
    const { hp: healthHp, note: healthHpNote } = computeHealthHp(fundamentals);

    return {
      ticker: displaySymbol,
      avatarUrl: avatar.url,
      avatarKind: avatar.kind,
      website,
      companyName: profile?.longName ?? quote?.longName ?? symbol,
      sector: gicsSector,
      industry: profile?.industry ?? "Unknown",
      pokemonType: sectorMapping.pokemonType,
      typeColor: sectorMapping.color,
      rarity: rarity.tier,
      evolutionStage: evolution.stage,
      price: regularPrice,
      priceChange,
      priceChangePercent,
      marketCap,
      healthHp,
      healthHpNote,
      stats: buildCardStats(fundamentals),
      specialAbility,
      balanceSheet,
      description,
      fetchedAt: new Date().toISOString(),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    throw new Error(
      `Could not fetch data for ${symbol}. Check the ticker and try again. (${msg})`
    );
  }
}

