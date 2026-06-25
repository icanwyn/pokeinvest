"use client";

import { BalanceSheetPanel } from "@/components/BalanceSheetPanel";
import { CardStatsPanel } from "@/components/CardStatsPanel";
import { PokemonCard } from "@/components/PokemonCard";
import { formatCurrency } from "@/lib/formatters";
import { holdingValue } from "@/lib/portfolio";
import type { PortfolioHolding } from "@/types/card";

interface CardDetailDrawerProps {
  mode: "watchlist" | "portfolio";
  holding: PortfolioHolding;
  onClose: () => void;
  onRefresh: () => void;
  onRemove: () => void;
  loading: boolean;
  onQuantityChange?: (qty: number) => void;
  onPurchase?: () => void;
  cashBalance?: number;
}

export function CardDetailDrawer({
  mode,
  holding,
  onClose,
  onRefresh,
  onRemove,
  loading,
  onQuantityChange,
  onPurchase,
  cashBalance,
}: CardDetailDrawerProps) {
  const isWatchlist = mode === "watchlist";
  const canAfford =
    typeof cashBalance !== "number" || cashBalance >= holding.price;

  return (
    <>
      <div className="pi-drawer__backdrop" onClick={onClose} />
      <aside className="pi-drawer__panel" role="dialog" aria-label={`${holding.ticker} details`}>
        <div className="pi-drawer__header">
          <div>
            <h2>{holding.companyName}</h2>
            <span className="pi-drawer__ticker">{holding.ticker}</span>
            {isWatchlist && (
              <span className="pi-drawer__mode-badge">👀 Watchlist</span>
            )}
          </div>
          <button className="pi-drawer__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="pi-drawer__preview">
          <PokemonCard
            card={holding}
            quantity={isWatchlist ? undefined : holding.quantity}
            variant={isWatchlist ? "watchlist" : "portfolio"}
          />
        </div>

        <div className="pi-drawer__price-row">
          <span className="pi-drawer__price">{formatCurrency(holding.price)}</span>
          <span className={holding.priceChange >= 0 ? "up" : "down"}>
            {holding.priceChange >= 0 ? "▲" : "▼"}{" "}
            {Math.abs(holding.priceChangePercent).toFixed(2)}% today
          </span>
        </div>

        <div className="pi-drawer__kid-view">
          <p>{holding.description}</p>
          <div className="pi-drawer__tags">
            <span style={{ color: holding.typeColor }}>{holding.sector}</span>
            <span>{holding.industry}</span>
          </div>
        </div>

        <CardStatsPanel card={holding} />

        {isWatchlist ? (
          <div className="pi-drawer__watchlist-note">
            <p>
              <strong>Research mode:</strong> This card is on your watchlist so you can
              study the company. When you&apos;re ready to &quot;own&quot; it, catch it
              for your portfolio ({formatCurrency(holding.price)} per share).
            </p>
            {typeof cashBalance === "number" && !canAfford && (
              <p className="pi-drawer__cash-warn">
                Not enough cash — you have {formatCurrency(cashBalance)}.
              </p>
            )}
          </div>
        ) : (
          <div className="pi-drawer__holding-edit">
            <label>
              Shares owned
              <input
                type="number"
                min={0}
                value={holding.quantity}
                onChange={(e) =>
                  onQuantityChange?.(parseInt(e.target.value, 10) || 0)
                }
                className="quantity-input detail-quantity"
              />
            </label>
            <div className="pi-drawer__position">
              <span>Position value</span>
              <strong>{formatCurrency(holdingValue(holding))}</strong>
            </div>
          </div>
        )}

        <div className="pi-drawer__parent-view">
          <BalanceSheetPanel card={holding} />
        </div>

        <div className="pi-drawer__actions">
          {isWatchlist && onPurchase && (
            <button
              className="add-btn pi-drawer__catch-btn"
              onClick={onPurchase}
              disabled={loading || !canAfford}
            >
              Catch {holding.ticker} for Portfolio! 🎯
            </button>
          )}
          <button className="refresh-btn" onClick={onRefresh} disabled={loading}>
            🔄 Refresh
          </button>
          <button className="pi-drawer__remove" onClick={onRemove}>
            {isWatchlist ? "Remove from Watchlist" : "Release Card"}
          </button>
        </div>
      </aside>
    </>
  );
}