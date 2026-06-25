import { SP500_DOMAINS } from "@/lib/sp500-domains";

/** Fallback domain map when Yahoo website field is missing or odd. */
export const TICKER_DOMAINS: Record<string, string> = {
  AAPL: "apple.com",
  MSFT: "microsoft.com",
  GOOG: "google.com",
  GOOGL: "google.com",
  AMZN: "amazon.com",
  META: "meta.com",
  NVDA: "nvidia.com",
  TSLA: "tesla.com",
  DIS: "disney.com",
  KO: "coca-cola.com",
  PEP: "pepsico.com",
  NKE: "nike.com",
  MCD: "mcdonalds.com",
  WMT: "walmart.com",
  SBUX: "starbucks.com",
  NFLX: "netflix.com",
  JPM: "jpmorganchase.com",
  V: "visa.com",
  MA: "mastercard.com",
  PG: "pg.com",
  XOM: "exxonmobil.com",
  COST: "costco.com",
  MAT: "mattel.com",
  HAS: "hasbro.com",
  BA: "boeing.com",
  JNJ: "jnj.com",
  UNH: "unitedhealthgroup.com",
  HD: "homedepot.com",
  BAC: "bankofamerica.com",
};

export function getDomainForTicker(ticker: string, website?: string): string | null {
  const fromWeb = website
    ? (() => {
        try {
          return new URL(website).hostname.replace(/^www\./, "");
        } catch {
          return null;
        }
      })()
    : null;

  if (fromWeb && !fromWeb.includes("stock.") && fromWeb.includes(".")) {
    return fromWeb;
  }

  const sym = ticker.toUpperCase();
  return TICKER_DOMAINS[sym] ?? SP500_DOMAINS[sym] ?? null;
}