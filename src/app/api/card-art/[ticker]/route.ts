import { CARD_ART_CATALOG, getCardArtPrompt } from "@/lib/card-art";
import { NextResponse } from "next/server";

/** Returns card art metadata and generation prompt for a ticker. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;
  const symbol = ticker.toUpperCase();
  const existing = CARD_ART_CATALOG.find((a) => a.ticker === symbol);

  if (existing) {
    return NextResponse.json(existing);
  }

  return NextResponse.json({
    ticker: symbol,
    path: null,
    essence: "Custom company mascot",
    prompt: getCardArtPrompt(symbol, symbol, "Unknown"),
    generated: false,
  });
}