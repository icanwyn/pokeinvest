"use client";

import { PokemonCard } from "@/components/PokemonCard";
import { formatCurrency } from "@/lib/formatters";
import type { CardGroup } from "@/lib/portfolio";
import type { PortfolioHolding } from "@/types/card";

interface CardGridProps {
  groups: CardGroup[];
  variant: "watchlist" | "portfolio";
  selectedTicker: string | null;
  onSelect: (ticker: string) => void;
  onRemove: (ticker: string) => void;
  onQuantityChange?: (ticker: string, quantity: number) => void;
}

export function CardGrid({
  groups,
  variant,
  selectedTicker,
  onSelect,
  onRemove,
  onQuantityChange,
}: CardGridProps) {
  const isWatchlist = variant === "watchlist";

  return (
    <div className="card-grid-container">
      {groups.map((group) => (
        <section key={group.key} className="card-group-section">
          {groups.length > 1 && (
            <div
              className="group-header"
              style={group.color ? { borderLeftColor: group.color } : undefined}
            >
              <span className="group-title">
                {group.emoji && <span>{group.emoji} </span>}
                {group.label}
              </span>
              <span className="group-meta">
                {group.holdings.length} card{group.holdings.length !== 1 ? "s" : ""}
                {!isWatchlist && <> · {formatCurrency(group.groupValue)}</>}
              </span>
            </div>
          )}
          <div className="card-grid pi-binder__grid">
            {group.holdings.map((holding) => (
              <PokemonCard
                key={holding.ticker}
                card={holding}
                quantity={isWatchlist ? undefined : holding.quantity}
                variant={variant}
                selected={selectedTicker === holding.ticker}
                onSelect={() => onSelect(holding.ticker)}
                onRemove={() => onRemove(holding.ticker)}
                onQuantityChange={
                  onQuantityChange
                    ? (qty) => onQuantityChange(holding.ticker, qty)
                    : undefined
                }
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}