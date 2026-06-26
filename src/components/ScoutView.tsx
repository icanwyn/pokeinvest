"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DISCOVERY_POOL,
  getDiscoveryBatch,
  type DiscoverableCompany,
} from "@/lib/discovery";
import {
  INTEREST_FILTERS,
  RARITY_PACKS,
  POWER_PACKS,
  filterByInterest,
  getPowerPackCompanies,
  getRarityPackCompanies,
} from "@/lib/interest-discovery";
import { searchSP500 } from "@/lib/sp500";
import { formatCurrency } from "@/lib/formatters";
import type { PokemonType, RarityTier } from "@/types/card";

const TYPE_FILTERS: { key: PokemonType | "all"; label: string }[] = [
  { key: "all", label: "All Types" },
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

type ScoutMode = "shuffle" | "interest" | "rarity" | "power";

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
  const [scoutMode, setScoutMode] = useState<ScoutMode>("interest");
  const [activeInterest, setActiveInterest] = useState(INTEREST_FILTERS[0].id);
  const [activeRarity, setActiveRarity] = useState<RarityTier>("holo-rare");
  const [activePower, setActivePower] = useState(POWER_PACKS[0].id);
  const [selected, setSelected] = useState<DiscoverableCompany | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [batch, setBatch] = useState<DiscoverableCompany[]>(() =>
    filterByInterest(INTEREST_FILTERS[0].id, trackedTickers, 8)
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

  const refreshBatch = useCallback(
    (mode: ScoutMode) => {
      let next: DiscoverableCompany[] = [];
      switch (mode) {
        case "interest":
          next = filterByInterest(activeInterest, trackedTickers, 8);
          break;
        case "rarity":
          next = getRarityPackCompanies(activeRarity, trackedTickers, 8);
          break;
        case "power":
          next = getPowerPackCompanies(activePower, trackedTickers, 8);
          break;
        default:
          next = getDiscoveryBatch(
            trackedTickers,
            8,
            filter === "all" ? undefined : filter
          );
      }
      setBatch(next);
      setSelected(next[0] ?? null);
    },
    [activeInterest, activePower, activeRarity, filter, trackedTickers]
  );

  const changeFilter = useCallback(
    (f: PokemonType | "all") => {
      setFilter(f);
      setScoutMode("shuffle");
      const next = getDiscoveryBatch(
        trackedTickers,
        8,
        f === "all" ? undefined : f
      );
      setBatch(next);
      setSelected(null);
    },
    [trackedTickers]
  );

  const pickInterest = (id: string) => {
    setActiveInterest(id);
    setScoutMode("interest");
    const next = filterByInterest(id, trackedTickers, 8);
    setBatch(next);
    setSelected(next[0] ?? null);
  };

  const pickRarity = (tier: RarityTier) => {
    setActiveRarity(tier);
    setScoutMode("rarity");
    const next = getRarityPackCompanies(tier, trackedTickers, 8);
    setBatch(next);
    setSelected(next[0] ?? null);
  };

  const pickPower = (id: string) => {
    setActivePower(id);
    setScoutMode("power");
    const next = getPowerPackCompanies(id, trackedTickers, 8);
    setBatch(next);
    setSelected(next[0] ?? null);
  };

  const pickSuggestion = (company: DiscoverableCompany) => {
    setTicker(company.ticker);
    setSelected(company);
    setShowSuggestions(false);
  };

  const activeTicker = selected?.ticker ?? ticker.trim().toUpperCase();
  const isOwned = activeTicker ? ownedSet.has(activeTicker) : false;

  const handleAddToWatchlist = () => {
    if (ticker.trim()) onAddToWatchlist(ticker.trim());
  };

  const remaining = DISCOVERY_POOL.length - trackedTickers.length;
  const activeInterestMeta = INTEREST_FILTERS.find((f) => f.id === activeInterest);
  const activeRarityMeta = RARITY_PACKS.find((p) => p.tier === activeRarity);
  const activePowerMeta = POWER_PACKS.find((p) => p.id === activePower);

  return (
    <div className="pi-scout">
      <div className="pi-hero">
        <h1 className="pi-hero__title">🔭 Scout — Find Your Next Card</h1>
        <p className="pi-hero__subtitle">
          Don&apos;t know a company name? Pick what you <strong>like</strong> — we&apos;ll
          show matching cards. Add to watchlist to study, catch when you&apos;re ready!
          {typeof cashBalance === "number" && (
            <> You have <strong>{formatCurrency(cashBalance)}</strong> to spend.</>
          )}
        </p>
      </div>

      <section className="pi-scout__kid-finder">
        <h2 className="pi-scout__kid-title">🎯 Find cards your way</h2>
        <p className="pi-scout__kid-lead">
          Tap an interest, rarity pack, or power deck — no ticker spelling required!
        </p>

        <div className="pi-scout__finder-block">
          <h3>What sounds fun to you?</h3>
          <div className="pi-scout__interest-grid">
            {INTEREST_FILTERS.map((interest) => (
              <button
                key={interest.id}
                type="button"
                className={`pi-scout__interest-card ${
                  scoutMode === "interest" && activeInterest === interest.id
                    ? "pi-scout__interest-card--active"
                    : ""
                }`}
                onClick={() => pickInterest(interest.id)}
              >
                <span className="pi-scout__interest-emoji">{interest.emoji}</span>
                <span className="pi-scout__interest-label">{interest.label}</span>
                <span className="pi-scout__interest-blurb">{interest.blurb}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="pi-scout__finder-block">
          <h3>Open a rarity pack</h3>
          <div className="pi-scout__chip-row pi-scout__chip-row--wrap">
            {RARITY_PACKS.map((pack) => (
              <button
                key={pack.tier}
                type="button"
                className={`pi-filters__chip pi-scout__rarity-chip pi-scout__rarity-chip--${pack.tier} ${
                  scoutMode === "rarity" && activeRarity === pack.tier
                    ? "pi-filters__chip--active"
                    : ""
                }`}
                onClick={() => pickRarity(pack.tier)}
                title={pack.kidLine}
              >
                {pack.emoji} {pack.label}
              </button>
            ))}
          </div>
          {scoutMode === "rarity" && activeRarityMeta && (
            <p className="pi-scout__mode-hint">{activeRarityMeta.kidLine}</p>
          )}
        </div>

        <div className="pi-scout__finder-block">
          <h3>Pick a power deck</h3>
          <div className="pi-scout__power-row">
            {POWER_PACKS.map((pack) => (
              <button
                key={pack.id}
                type="button"
                className={`pi-scout__power-card ${
                  scoutMode === "power" && activePower === pack.id
                    ? "pi-scout__power-card--active"
                    : ""
                }`}
                onClick={() => pickPower(pack.id)}
              >
                <span className="pi-scout__power-emoji">{pack.emoji}</span>
                <strong>{pack.label}</strong>
                <span>{pack.blurb}</span>
              </button>
            ))}
          </div>
        </div>

        {scoutMode === "interest" && activeInterestMeta && (
          <p className="pi-scout__mode-hint">
            Showing companies that match <strong>{activeInterestMeta.label}</strong>
          </p>
        )}
        {scoutMode === "power" && activePowerMeta && (
          <p className="pi-scout__mode-hint">{activePowerMeta.blurb}</p>
        )}
      </section>

      <div className="pi-scout__search-hero pi-scout__search-wrap">
        <label className="pi-scout__search-label">Already know the name? Search here</label>
        <input
          type="text"
          placeholder="AAPL, Disney, Nike..."
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
        <span className="pi-scout__chip-label">Or filter by type:</span>
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.key}
            className={`pi-filters__chip ${filter === f.key && scoutMode === "shuffle" ? "pi-filters__chip--active" : ""}`}
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
          <button
            className="pi-scout__shuffle"
            onClick={() => refreshBatch(scoutMode)}
            disabled={loading}
          >
            🔄 Show Me More
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