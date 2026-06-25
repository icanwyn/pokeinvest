"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/formatters";
import type { PortfolioStats } from "@/lib/portfolio";

interface PortfolioSummaryProps {
  stats: PortfolioStats;
}

export function PortfolioSummary({ stats }: PortfolioSummaryProps) {
  const [collapsed, setCollapsed] = useState(false);
  const isUp = stats.totalDayChange >= 0;
  const topTypes = Object.entries(stats.byType)
    .sort((a, b) => b[1].value - a[1].value)
    .slice(0, 4);
  const topSectors = Object.entries(stats.bySector)
    .sort((a, b) => b[1].value - a[1].value)
    .slice(0, 4);

  return (
    <div className={`portfolio-summary ${collapsed ? "collapsed" : ""}`}>
      <button
        className="portfolio-toggle"
        onClick={() => setCollapsed((c) => !c)}
        aria-expanded={!collapsed}
      >
        <div className="portfolio-toggle-left">
          <span className="portfolio-toggle-title">💰 Trainer Portfolio</span>
          <span className="portfolio-toggle-value">{formatCurrency(stats.totalValue)}</span>
          <span className={`portfolio-toggle-change ${isUp ? "up" : "down"}`}>
            {isUp ? "▲" : "▼"} {Math.abs(stats.totalDayChangePercent).toFixed(2)}% today
          </span>
        </div>
        <span className="portfolio-chevron">{collapsed ? "▼" : "▲"}</span>
      </button>

      {!collapsed && (
        <div className="portfolio-body">
          <div className="portfolio-hero">
            <div className="portfolio-stat-main">
              <span className="portfolio-label">Total Portfolio Value</span>
              <span className="portfolio-value">{formatCurrency(stats.totalValue)}</span>
              <span className={`portfolio-change ${isUp ? "up" : "down"}`}>
                {isUp ? "▲" : "▼"} {formatCurrency(Math.abs(stats.totalDayChange))} (
                {Math.abs(stats.totalDayChangePercent).toFixed(2)}%) today
              </span>
            </div>
            <div className="portfolio-stat-row">
              <div className="portfolio-mini-stat">
                <span className="mini-label">Unique Cards</span>
                <span className="mini-value">{stats.uniqueCards}</span>
              </div>
              <div className="portfolio-mini-stat">
                <span className="mini-label">Total Shares</span>
                <span className="mini-value">{stats.totalShares}</span>
              </div>
            </div>
          </div>

          <div className="portfolio-breakdown">
            <div className="breakdown-section">
              <h4>By Pokémon Type</h4>
              {topTypes.map(([type, data]) => (
                <div key={type} className="breakdown-bar-row">
                  <span className="breakdown-name">{type}</span>
                  <div className="breakdown-bar-track">
                    <div
                      className="breakdown-bar-fill type-bar"
                      style={{
                        width: `${stats.totalValue > 0 ? (data.value / stats.totalValue) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="breakdown-val">
                    {formatCurrency(data.value)}
                    <span className="breakdown-shares">({data.shares} shares)</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="breakdown-section">
              <h4>By Sector</h4>
              {topSectors.map(([sector, data]) => (
                <div key={sector} className="breakdown-bar-row">
                  <span className="breakdown-name">{sector}</span>
                  <div className="breakdown-bar-track">
                    <div
                      className="breakdown-bar-fill sector-bar"
                      style={{
                        width: `${stats.totalValue > 0 ? (data.value / stats.totalValue) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <span className="breakdown-val">
                    {formatCurrency(data.value)}
                    <span className="breakdown-shares">({data.shares} shares)</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}