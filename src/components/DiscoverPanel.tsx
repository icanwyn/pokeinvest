"use client";

import { useCallback, useState } from "react";
import {
  DISCOVERY_POOL,
  getDiscoveryBatch,
  type DiscoverableCompany,
} from "@/lib/discovery";
import type { PokemonType } from "@/types/card";

const TYPE_FILTERS: { key: PokemonType | "all"; label: string }[] = [
  { key: "all", label: "All Types" },
  { key: "electric", label: "⚡ Electric" },
  { key: "psychic", label: "🔮 Psychic" },
  { key: "grass", label: "🌿 Grass" },
  { key: "normal", label: "⭐ Normal" },
  { key: "fire", label: "🔥 Fire" },
  { key: "fighting", label: "👊 Fighting" },
];

interface DiscoverPanelProps {
  ownedTickers: string[];
  onDiscover: (ticker: string) => void;
  onClose: () => void;
  loading: boolean;
}

export function DiscoverPanel({
  ownedTickers,
  onDiscover,
  onClose,
  loading,
}: DiscoverPanelProps) {
  const [filter, setFilter] = useState<PokemonType | "all">("all");
  const [batch, setBatch] = useState<DiscoverableCompany[]>(() =>
    getDiscoveryBatch(ownedTickers, 4)
  );

  const reshuffle = useCallback(() => {
    setBatch(
      getDiscoveryBatch(
        ownedTickers,
        4,
        filter === "all" ? undefined : filter
      )
    );
  }, [ownedTickers, filter]);

  const changeFilter = useCallback(
    (f: PokemonType | "all") => {
      setFilter(f);
      setBatch(
        getDiscoveryBatch(ownedTickers, 4, f === "all" ? undefined : f)
      );
    },
    [ownedTickers]
  );

  const remaining = DISCOVERY_POOL.length - ownedTickers.length;

  return (
    <div className="discover-overlay" onClick={onClose}>
      <div className="discover-panel" onClick={(e) => e.stopPropagation()}>
        <div className="discover-header">
          <h2>🔍 Card Discovery</h2>
          <p>Explore new companies to add to your binder!</p>
          <button className="discover-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="discover-filters">
          {TYPE_FILTERS.map((f) => (
            <button
              key={f.key}
              className={`discover-filter-btn ${filter === f.key ? "active" : ""}`}
              onClick={() => changeFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="discover-remaining">
          {remaining} companies left to discover
        </p>

        {batch.length === 0 ? (
          <div className="discover-empty">
            <span>🎉</span>
            <p>You&apos;ve discovered every company in this region!</p>
            <p className="discover-empty-hint">Try entering a custom ticker above.</p>
          </div>
        ) : (
          <div className="discover-grid">
            {batch.map((company) => (
              <button
                key={company.ticker}
                className="discover-card"
                onClick={() => onDiscover(company.ticker)}
                disabled={loading}
              >
                <span className="discover-emoji">{company.emoji}</span>
                <span className="discover-ticker">{company.ticker}</span>
                <span className="discover-name">{company.name}</span>
                <span className="discover-hint">{company.hint}</span>
                <span className="discover-catch">Catch! 🎯</span>
              </button>
            ))}
          </div>
        )}

        <button className="discover-shuffle" onClick={reshuffle} disabled={loading}>
          🔄 Discover More
        </button>
      </div>
    </div>
  );
}