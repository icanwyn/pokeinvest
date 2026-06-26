"use client";

import { RARITY_TIERS } from "@/lib/mappings/rarity";
import { EVOLUTION_STAGES } from "@/lib/mappings/evolution";
import { formatCurrency, formatLargeNumber } from "@/lib/formatters";
import {
  findPeStat,
  formatPeDisplay,
  HEALTH_HP_EXPLANATION,
  resolveDisplayHealthHp,
  TKT_EXPLANATION,
} from "@/lib/mappings/fundamentals";
import { formatMarketCap } from "@/lib/mappings/rarity";
import type { StockCard } from "@/types/card";

const TYPE_LABELS: Record<string, string> = {
  fire: "Fire", water: "Water", grass: "Grass", electric: "Electric",
  psychic: "Psychic", fighting: "Fighting", steel: "Steel", fairy: "Fairy",
  dark: "Dark", normal: "Normal", dragon: "Dragon",
};

export type HoverPlacement = "above" | "below";

interface CardHoverInfoProps {
  card: StockCard;
  quantity?: number;
  placement?: HoverPlacement;
}

export function CardHoverInfo({
  card,
  quantity = 1,
  placement = "above",
}: CardHoverInfoProps) {
  const rarity = RARITY_TIERS.find((r) => r.tier === card.rarity);
  const evolution = EVOLUTION_STAGES.find((e) => e.stage === card.evolutionStage);
  const isUp = card.priceChange >= 0;
  const bs = card.balanceSheet;
  const displayHp = resolveDisplayHealthHp(card);
  const hpNote = card.healthHpNote ?? HEALTH_HP_EXPLANATION;
  const tktStat = findPeStat(card.stats);
  const displayTkt = formatPeDisplay(tktStat?.value ?? "—");
  const companyLabel = card.companyName?.trim() || card.ticker;
  const description =
    card.description?.trim() ||
    `${companyLabel} — ${card.sector || "public"} company. Tap the card for full details.`;

  return (
    <div
      className={`card-hover-info card-hover-info--${placement}`}
      role="tooltip"
    >
      <div className="hover-info-header">
        <strong>{companyLabel}</strong>
        <span className="hover-ticker">{card.ticker}</span>
      </div>

      <p className="hover-desc">{description}</p>

      <div className="hover-meta-row">
        <span style={{ color: card.typeColor }}>
          {TYPE_LABELS[card.pokemonType]} · {card.sector}
        </span>
        <span>{rarity?.label} · {evolution?.label}</span>
      </div>

      <div className="hover-price-row">
        <span>{formatCurrency(card.price)}</span>
        <span className={isUp ? "up" : "down"}>
          {isUp ? "▲" : "▼"} {Math.abs(card.priceChangePercent).toFixed(2)}%
        </span>
        <span>Cap: {formatMarketCap(card.marketCap)}</span>
      </div>

      <div className="hover-hp-row" title={hpNote}>
        <span className="hover-stat-label">HP</span>
        <span className="hover-stat-val">{displayHp}</span>
        <span className="hover-hp-note">Financial stamina</span>
      </div>

      <div className="hover-tkt-row" title={tktStat?.kidExplanation ?? TKT_EXPLANATION}>
        <span className="hover-stat-label">TKT</span>
        <span className="hover-stat-val">{displayTkt}</span>
        <span className="hover-hp-note">P/E ticket price</span>
      </div>

      <div className="hover-stats-grid">
        {card.stats
          .filter((s) => s.label !== "TKT" && s.label !== "PWR")
          .map((s) => (
          <div key={s.label} className="hover-stat" title={s.kidExplanation}>
            <span className="hover-stat-label">{s.label}</span>
            <span className="hover-stat-val">{s.value}</span>
          </div>
        ))}
      </div>

      {card.specialAbility && (
        <div className="hover-ability">
          ⚡ {card.specialAbility.name} — {card.specialAbility.value}
        </div>
      )}

      <div className="hover-balance">
        <span>Assets {formatLargeNumber(bs.totalAssets)}</span>
        <span>Debt {formatLargeNumber(bs.totalDebt)}</span>
        <span>Cash {formatLargeNumber(bs.cash)}</span>
      </div>

      {quantity > 0 ? (
        <div className="hover-holding">
          Holding: {quantity} share{quantity !== 1 ? "s" : ""} = {formatCurrency(card.price * quantity)}
        </div>
      ) : (
        <div className="hover-watchlist">👀 On watchlist — study before you catch!</div>
      )}
    </div>
  );
}