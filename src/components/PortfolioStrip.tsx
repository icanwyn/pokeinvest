"use client";

import { formatCurrency } from "@/lib/formatters";
import type { PortfolioStats } from "@/lib/portfolio";

interface PortfolioStripProps {
  stats: PortfolioStats;
  compact?: boolean;
  onExpand?: () => void;
}

export function PortfolioStrip({ stats, compact, onExpand }: PortfolioStripProps) {
  const isUp = stats.totalDayChange >= 0;
  const topSector = Object.entries(stats.bySector).sort((a, b) => b[1].value - a[1].value)[0];

  if (compact) {
    return (
      <button className="pi-portfolio-strip pi-portfolio-strip--compact" onClick={onExpand}>
        <span className="pi-portfolio-strip__value">{formatCurrency(stats.totalValue)}</span>
        <span className={`pi-portfolio-strip__change ${isUp ? "up" : "down"}`}>
          {isUp ? "▲" : "▼"} {formatCurrency(Math.abs(stats.totalDayChange))}
        </span>
        <span className="pi-portfolio-strip__stat">{stats.uniqueCards} cards</span>
      </button>
    );
  }

  return (
    <div className="pi-portfolio-strip">
      <div className="pi-portfolio-strip__primary">
        <span className="pi-portfolio-strip__label">Trainer Portfolio</span>
        <span className="pi-portfolio-strip__value">{formatCurrency(stats.totalValue)}</span>
        <span className={`pi-portfolio-strip__change ${isUp ? "up" : "down"}`}>
          {isUp ? "▲" : "▼"} {formatCurrency(Math.abs(stats.totalDayChange))} (
          {Math.abs(stats.totalDayChangePercent).toFixed(2)}%) today
        </span>
      </div>
      <div className="pi-portfolio-strip__stats">
        <div className="pi-portfolio-strip__stat">
          <span className="stat-num">{stats.uniqueCards}</span>
          <span className="stat-lbl">Cards</span>
        </div>
        <div className="pi-portfolio-strip__stat">
          <span className="stat-num">{stats.totalShares}</span>
          <span className="stat-lbl">Shares</span>
        </div>
        <div className="pi-portfolio-strip__stat">
          <span className="stat-num">{Object.keys(stats.bySector).length}</span>
          <span className="stat-lbl">Sectors</span>
        </div>
        {topSector && (
          <div className="pi-portfolio-strip__stat pi-portfolio-strip__stat--highlight">
            <span className="stat-num">{topSector[0]}</span>
            <span className="stat-lbl">Top sector · {formatCurrency(topSector[1].value)}</span>
          </div>
        )}
      </div>
    </div>
  );
}