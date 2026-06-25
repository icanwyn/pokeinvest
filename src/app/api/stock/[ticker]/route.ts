import { fetchStockData } from "@/lib/stock-service";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;

  if (!ticker || ticker.length > 10) {
    return NextResponse.json({ error: "Invalid ticker symbol" }, { status: 400 });
  }

  try {
    const card = await fetchStockData(ticker);
    return NextResponse.json(card);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch stock data";
    return NextResponse.json({ error: message }, { status: 404 });
  }
}