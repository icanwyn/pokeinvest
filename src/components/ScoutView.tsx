"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DISCOVERY_POOL,
  getDiscoveryBatch,
  type DiscoverableCompany,
} from "@/lib/discovery";
import { searchSP500 } from "@/lib/sp500";
import { formatCurrency } from "@/lib/formatters";
import type { PokemonType } from "@/types/card";

const TYPE_FILTERS: { key: PokemonType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "electric", label: "⚡ Tech" },
  { key: "psychic", label: "🔮 Finance" },
  { key: "grass", label: "🌿 Food" },
  { key: "normal", label: "⭐ Fun" },
  { key: "fire", label: "🔥 Energy" },
  { key: "fighting", label: "👊 Industrial" },
  { key: "fairy", label: "💊 Health" },
  { key: "water", label: "💧 Utilities" },
  { key: "steel", label: "⚙️ Materials" },
  { key: "dragon", label: "🏠 Real Estate" },
];

interface ScoutViewProps {
  trackedTickers: string[];
  watchedTickers: string[];
  ownedTickers: string[];
  onAddToWatchlist: (ticker: string) => void;
  onPurchase: (ticker: string) => void;
  loading: boolean;
  error: string | null;
  cashBalance?: number;
}

export function ScoutView({
  trackedTickers,
  watchedTickers,
  ownedTickers,
  onAddToWatchlist,
  onPurchase,
  loading,
  error,
  cashBalance,
}: ScoutViewProps) {
  const [ticker, setTicker] = useState("");
  const [filter, setFilter] = useState<PokemonType | "all">("all");
  const [selected, setSelected] = useState<DiscoverableCompany | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [batch, setBatch] = useState<DiscoverableCompany[]>(() =>
    getDiscoveryBatch(trackedTickers, 8)
  );

  const trackedSet = useMemo(
    () => new Set(trackedTickers.map((t) => t.toUpperCase())),
    [trackedTickers]
  );
  const watchedSet = useMemo(
    () => new Set(watchedTickers.map((t) => t.toUpperCase())),
    [watchedTickers]
  );
  const ownedSet = useMemo(
    () => new Set(ownedTickers.map((t) => t.toUpperCase())),
    [ownedTickers]
  );

  const suggestions = useMemo(() => {
    if (ticker.trim().length < 1) return [];
    return searchSP500(ticker, 12).filter((c) => !trackedSet.has(c.ticker));
  }, [ticker, trackedSet]);

  const reshuffle = useCallback(() => {
    setBatch(getDiscoveryBatch(trackedTickers, 8, filter === "all" ? undefined : filter));
    setSelected(null);
  }, [trackedTickers, filter]);

  const changeFilter = useCallback(
    (f: PokemonType | "all") => {
      setFilter(f);
      setBatch(getDiscoveryBatch(trackedTickers, 8, f === "all" ? undefined : f));
      setSelected(null);
    },
    [trackedTickers]
  );

  const pickSuggestion = (company: DiscoverableCompany) => {
    setTicker(company.ticker);
    setSelected(company);
    setShowSuggestions(false);
  };

  const activeTicker = selected?.ticker ?? ticker.trim().toUpperCase();
  const isOwned = activeTicker ? ownedSet.has(activeTicker) : false;
  const isWatched = activeTicker ? watchedSet.has(activeTicker) : false;

  const handleAddToWatchlist = () => {
    if (ticker.trim()) onAddToWatchlist(ticker.trim());
  };

  const remaining = DISCOVERY_POOL.length - trackedTickers.length;

  return (
    <div className="pi-scout">
      <div className="pi-hero">
        <h1 className="pi-hero__title">🔭 Scout — Find Your Next Card</h1>
        <p className="pi-hero__subtitle">
          Add companies to your watchlist to learn — catch them when you&apos;re ready to own!
          {typeof cashBalance === "number" && (
            <> You have <strong>{formatCurrency(cashBalance)}</strong> to spend.</>
          )}
        </p>
      </div>

      <div className="pi-scout__search-hero pi-scout__search-wrap">
        <input
          type="text"
          placeholder="Search ticker or company (AAPL, Disney, Nike...)"
          value={ticker}
          onChange={(e) => {
            setTicker(e.target.value.toUpperCase());
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={(e) => e.key === "Enter" && !isOwned && handleAddToWatchlist()}
          className="ticker-input pi-scout__search-input"
          maxLength={40}
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="pi-scout__suggestions" role="listbox">
            {suggestions.map((company) => (
              <li key={company.ticker}>
                <button
                  type="button"
                  className="pi-scout__suggestion-item"
                  onMouseDown={() => pickSuggestion(company)}
                >
                  <span>{company.emoji}</span>
                  <span className="pi-scout__suggestion-ticker">{company.ticker}</span>
                  <span className="pi-scout__suggestion-name">{company.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <button
          className="add-btn pi-scout__watch-cta"
          onClick={handleAddToWatchlist}
          disabled={loading || !ticker.trim() || isOwned}
        >
          {loading ? "Adding..." : isOwned ? "In Portfolio ✓" : "Add to Watchlist 👀"}
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      <div className="pi-scout__chip-row">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.key}
            className={`pi-filters__chip ${filter === f.key ? "pi-filters__chip--active" : ""}`}
            onClick={() => changeFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="pi-scout__remaining">
        {remaining} of {DISCOVERY_POOL.length} S&amp;P 500 companies left to scout
      </p>

      <div className="pi-scout__layout">
        <div className="pi-scout__results-list">
          {batch.map((company) => (
            <button
              key={company.ticker}
              className={`pi-scout__result-row ${selected?.ticker === company.ticker ? "pi-scout__result-row--active" : ""}`}
              onClick={() => setSelected(company)}
            >
              <span className="pi-scout__result-emoji">{company.emoji}</span>
              <div className="pi-scout__result-info">
                <span className="pi-scout__result-ticker">{company.ticker}</span>
                <span className="pi-scout__result-name">{company.name}</span>
              </div>
            </button>
          ))}
          <button className="pi-scout__shuffle" onClick={reshuffle} disabled={loading}>
            🔄 Discover More
          </button>
        </div>

        <div className="pi-scout__preview">
          {selected ? (
            <>
              <span className="pi-scout__preview-emoji">{selected.emoji}</span>
              <h3>{selected.name}</h3>
              <span className="pi-scout__preview-ticker">{selected.ticker}</span>
              <p className="pi-scout__preview-hint">{selected.hint}</p>
              <div className="pi-scout__preview-actions">
                {ownedSet.has(selected.ticker) ? (
                  <p className="pi-scout__status-msg">Already in your portfolio! 🎯</p>
                ) : watchedSet.has(selected.ticker) ? (
                  <>
                    <p className="pi-scout__status-msg">On your watchlist 👀</p>
                    <button
                      className="add-btn pi-scout__catch-cta"
                      onClick={() => onPurchase(selected.ticker)}
                      disabled={loading}
                    >
                      Catch {selected.ticker}! 🎯
                    </button>
                  </>
                ) : (
                  <button
                    className="add-btn pi-scout__watch-cta"
                    onClick={() => onAddToWatchlist(selected.ticker)}
                    disabled={loading}
                  >
                    Add to Watchlist 👀
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="pi-scout__preview-empty">
              <span>👈</span>
              <p>Pick a company to preview — add to watchlist to learn more</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}