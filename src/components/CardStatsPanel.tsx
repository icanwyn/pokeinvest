"use client";

import {
  findPeStat,
  formatPeDisplay,
  resolveDisplayHealthHp,
  TKT_EXPLANATION,
} from "@/lib/mappings/fundamentals";
import type { StockCard } from "@/types/card";

interface CardStatsPanelProps {
  card: StockCard;
}

export function CardStatsPanel({ card }: CardStatsPanelProps) {
  const tktStat = findPeStat(card.stats);
  const displayHp = resolveDisplayHealthHp(card);
  const otherStats = card.stats.filter((s) => s.label !== "TKT" && s.label !== "PWR");

  return (
    <div className="pi-card-stats">
      <h4 className="pi-card-stats__title">Card Stats</h4>
      <div className="pi-card-stats__highlight">
        <div className="pi-card-stats__highlight-item" title={card.healthHpNote}>
          <span className="pi-card-stats__label">HP</span>
          <span className="pi-card-stats__value">{displayHp}</span>
          <span className="pi-card-stats__hint">Company health</span>
        </div>
        <div
          className="pi-card-stats__highlight-item pi-card-stats__highlight-item--tkt"
          title={tktStat?.kidExplanation ?? TKT_EXPLANATION}
        >
          <span className="pi-card-stats__label">TKT</span>
          <span className="pi-card-stats__value">{formatPeDisplay(tktStat?.value ?? "—")}</span>
          <span className="pi-card-stats__hint">P/E ticket price</span>
        </div>
      </div>
      <div className="pi-card-stats__grid">
        {otherStats.map((s) => (
          <div key={s.label} className="pi-card-stats__cell" title={s.kidExplanation}>
            <span className="pi-card-stats__label">{s.label}</span>
            <span className="pi-card-stats__value pi-card-stats__value--sm">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}