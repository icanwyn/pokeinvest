"use client";

import { useRef, useState } from "react";
import { CardArt } from "@/components/CardArt";
import { RARITY_TIERS } from "@/lib/mappings/rarity";
import { EVOLUTION_STAGES } from "@/lib/mappings/evolution";
import { formatCurrency } from "@/lib/formatters";
import { holdingValue } from "@/lib/portfolio";
import { CardHoverInfo, type HoverPlacement } from "@/components/CardHoverInfo";
import {
  findPeStat,
  formatPeDisplay,
  resolveDisplayHealthHp,
  TKT_EXPLANATION,
} from "@/lib/mappings/fundamentals";
import type { StockCard } from "@/types/card";

const TOOLTIP_EST_HEIGHT = 400;
const STICKY_HEADER_HEIGHT = 80;

interface PokemonCardProps {
  card: StockCard;
  quantity?: number;
  variant?: "watchlist" | "portfolio";
  onRemove?: () => void;
  onSelect?: () => void;
  onQuantityChange?: (quantity: number) => void;
  selected?: boolean;
}

const TYPE_LABELS: Record<string, string> = {
  fire: "Fire", water: "Water", grass: "Grass", electric: "Electric",
  psychic: "Psychic", fighting: "Fighting", steel: "Steel", fairy: "Fairy",
  dark: "Dark", normal: "Normal", dragon: "Dragon",
};

export function PokemonCard({
  card,
  quantity = 1,
  variant = "portfolio",
  onRemove,
  onSelect,
  onQuantityChange,
  selected,
}: PokemonCardProps) {
  const isWatchlist = variant === "watchlist";
  const rarity = RARITY_TIERS.find((r) => r.tier === card.rarity) ?? RARITY_TIERS[0];
  const evolution = EVOLUTION_STAGES.find((e) => e.stage === card.evolutionStage) ?? EVOLUTION_STAGES[0];
  const atkStat = card.stats.find((s) => s.label === "ATK");
  const tktStat = findPeStat(card.stats);
  const displayHp = resolveDisplayHealthHp(card);
  const displayTkt = formatPeDisplay(tktStat?.value ?? "—");

  const cardRef = useRef<HTMLDivElement>(null);
  const [hoverPlacement, setHoverPlacement] = useState<HoverPlacement>("above");

  const handleCardMouseEnter = () => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    const spaceAbove = rect.top - STICKY_HEADER_HEIGHT;
    const spaceBelow = window.innerHeight - rect.bottom;

    if (spaceAbove < TOOLTIP_EST_HEIGHT && spaceBelow > spaceAbove) {
      setHoverPlacement("below");
    } else {
      setHoverPlacement("above");
    }
  };

  const handleQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    const val = Math.max(0, parseInt(e.target.value, 10) || 0);
    onQuantityChange?.(val);
  };

  return (
    <div
      className="poke-card-wrap"
      ref={cardRef}
      onMouseEnter={handleCardMouseEnter}
    >
      <div
        className={`poke-card ${rarity.borderClass} ${selected ? "selected" : ""}`}
        onClick={onSelect}
        style={{ "--type-color": card.typeColor } as React.CSSProperties}
      >

        <div className="card-top-bar">
          <span className="card-stage">{evolution.label}</span>
          {isWatchlist ? (
            <span className="card-watch-badge">👀 Watching</span>
          ) : (
            <span className="card-rarity-mini">{rarity.label}</span>
          )}
        </div>

        <div className="card-header">
          <h3 className="card-name">{card.ticker}</h3>
          <span className="card-hp">
            <span className="hp-label">HP</span>
            <span className="hp-value">{displayHp}</span>
          </span>
        </div>

        <span className="type-badge" style={{ backgroundColor: card.typeColor }}>
          {TYPE_LABELS[card.pokemonType]}
        </span>

        <div className="card-art">
          <div className="art-placeholder">
            <CardArt card={card} />
          </div>
        </div>

        <div className="card-moves">
          <div
            className="move-cell"
            title={tktStat?.kidExplanation ?? TKT_EXPLANATION}
          >
            <span className="move-icon">🎫</span>
            <span className="move-label">TKT</span>
            <span className="move-val">{displayTkt}</span>
          </div>
          <div className="move-cell" title={atkStat?.kidExplanation}>
            <span
              className="move-icon move-dot"
              style={{ backgroundColor: card.typeColor }}
            />
            <span className="move-label">ATK</span>
            <span className="move-val">{atkStat?.value ?? "—"}</span>
          </div>
        </div>

        {card.specialAbility && (
          <div className="card-ability">
            <span className="card-ability-icon">⚡</span>
            <span className="card-ability-name">{card.specialAbility.name}</span>
            <span className="card-ability-val">{card.specialAbility.value}</span>
          </div>
        )}

        <div className="card-footer">
          <span className="footer-price">{formatCurrency(card.price)}</span>
        </div>

        {onRemove && (
          <button
            className="remove-btn"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            aria-label={`Remove ${card.ticker}`}
          >
            ✕
          </button>
        )}

      </div>

      <CardHoverInfo
        card={card}
        quantity={isWatchlist ? 0 : quantity}
        placement={hoverPlacement}
      />

      {isWatchlist ? (
        <div className="card-watchlist-chip">
          <span>👀 On watchlist — tap to learn</span>
        </div>
      ) : (
        onQuantityChange && (
          <div className="card-quantity-chip" onClick={(e) => e.stopPropagation()}>
            <input
              type="number"
              min={0}
              step={1}
              value={quantity}
              onChange={handleQuantity}
              className="quantity-input"
              aria-label={`Shares of ${card.ticker}`}
            />
            <span className="chip-value">{formatCurrency(holdingValue({ ...card, quantity }))}</span>
          </div>
        )
      )}
    </div>
  );
}