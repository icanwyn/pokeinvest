"use client";

import { formatLargeNumber } from "@/lib/formatters";
import type { StockCard } from "@/types/card";

interface BalanceSheetPanelProps {
  card: StockCard;
}

export function BalanceSheetPanel({ card }: BalanceSheetPanelProps) {
  const bs = card.balanceSheet;
  const maxBar = Math.max(bs.totalAssets, bs.totalLiabilities, bs.totalEquity, 1);

  const items = [
    {
      label: "Total Assets",
      value: bs.totalAssets,
      color: "#78C850",
      emoji: "🎒",
      tip: "Everything the company OWNS — cash, buildings, inventory. Like your Pokémon's items!",
    },
    {
      label: "Total Liabilities",
      value: bs.totalLiabilities,
      color: "#F85888",
      emoji: "📋",
      tip: "Everything the company OWES — loans and bills. Like energy you borrowed!",
    },
    {
      label: "Shareholder Equity",
      value: bs.totalEquity,
      color: "#6890F0",
      emoji: "💎",
      tip: "Assets minus liabilities — what's truly theirs. The company's net worth!",
    },
    {
      label: "Cash on Hand",
      value: bs.cash,
      color: "#F8D030",
      emoji: "💰",
      tip: "Ready money in the bank — like having Full Restores in your bag!",
    },
    {
      label: "Total Debt",
      value: bs.totalDebt,
      color: "#C03028",
      emoji: "⛓️",
      tip: "Money borrowed that must be paid back. Too much debt = low Defense stat!",
    },
  ];

  return (
    <div className="balance-panel">
      <h3 className="panel-title">📊 Balance Sheet — Trainer&apos;s Inventory</h3>
      <p className="panel-subtitle">
        Assets (what it owns) vs. Liabilities (what it owes) for{" "}
        <strong>{card.companyName}</strong>
      </p>

      <div className="balance-grid">
        {items.map((item) => (
          <div key={item.label} className="balance-item" title={item.tip}>
            <div className="balance-item-header">
              <span>{item.emoji} {item.label}</span>
              <span className="balance-value">{formatLargeNumber(item.value)}</span>
            </div>
            <div className="balance-bar-track">
              <div
                className="balance-bar-fill"
                style={{
                  width: `${(item.value / maxBar) * 100}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="balance-equation">
        <span>Assets = Liabilities + Equity</span>
        <span className="current-ratio">
          Current Ratio: <strong>{bs.currentRatio.toFixed(2)}</strong>
          <span className="ratio-tip" title="Can the company pay short-term bills? Above 1.0 is healthy!">
            {" "}ℹ️
          </span>
        </span>
      </div>
    </div>
  );
}