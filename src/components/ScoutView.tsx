"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PokemonCard } from "@/components/PokemonCard";
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
import { toScoutPreviewCard } from "@/lib/scout-preview-card";
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

const PACK_SIZE = 6;

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
  const packRevealRef = useRef<HTMLDivElement>(null);
  const [ticker, setTicker] = useState("");
  const [filter, setFilter] = useState<PokemonType | "all">("all");
  const [scoutMode, setScoutMode] = useState<ScoutMode>("interest");
  const [activeInterest, setActiveInterest] = useState(INTEREST_FILTERS[0].id);
  const [activeRarity, setActiveRarity] = useState<RarityTier>("holo-rare");
  const [activePower, setActivePower] = useState(POWER_PACKS[0].id);
  const [selected, setSelected] = useState<DiscoverableCompany | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [packPulse, setPackPulse] = useState(0);
  const [batch, setBatch] = useState<DiscoverableCompany[]>(() =>
    filterByInterest(INTEREST_FILTERS[0].id, trackedTickers, PACK_SIZE)
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

  const revealPack = useCallback((next: DiscoverableCompany[], pick?: DiscoverableCompany | null) => {
    setBatch(next);
    setSelected(pick ?? next[0] ?? null);
    setPackPulse((n) => n + 1);
  }, []);

  useEffect(() => {
    if (packPulse === 0) return;
    packRevealRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [packPulse, batch]);

  const previewRarity = scoutMode === "rarity" ? activeRarity : undefined;

  const refreshBatch = useCallback(
    (mode: ScoutMode) => {
      let next: DiscoverableCompany[] = [];
      switch (mode) {
        case "interest":
          next = filterByInterest(activeInterest, trackedTickers, PACK_SIZE);
          break;
        case "rarity":
          next = getRarityPackCompanies(activeRarity, trackedTickers, PACK_SIZE);
          break;
        case "power":
          next = getPowerPackCompanies(activePower, trackedTickers, PACK_SIZE);
          break;
        default:
          next = getDiscoveryBatch(
            trackedTickers,
            PACK_SIZE,
            filter === "all" ? undefined : filter
          );
      }
      revealPack(next);
    },
    [activeInterest, activePower, activeRarity, filter, revealPack, trackedTickers]
  );

  const changeFilter = useCallback(
    (f: PokemonType | "all") => {
      setFilter(f);
      setScoutMode("shuffle");
      revealPack(
        getDiscoveryBatch(trackedTickers, PACK_SIZE, f === "all" ? undefined : f),
        null
      );
    },
    [revealPack, trackedTickers]
  );

  const pickInterest = (id: string) => {
    setActiveInterest(id);
    setScoutMode("interest");
    revealPack(filterByInterest(id, trackedTickers, PACK_SIZE));
  };

  const pickRarity = (tier: RarityTier) => {
    setActiveRarity(tier);
    setScoutMode("rarity");
    revealPack(getRarityPackCompanies(tier, trackedTickers, PACK_SIZE));
  };

  const pickPower = (id: string) => {
    setActivePower(id);
    setScoutMode("power");
    revealPack(getPowerPackCompanies(id, trackedTickers, PACK_SIZE));
  };

  const pickSuggestion = (company: DiscoverableCompany) => {
    setTicker(company.ticker);
    setSelected(company);
    setShowSuggestions(false);
    revealPack([company], company);
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

  const packTitle = (() => {
    if (scoutMode === "interest" && activeInterestMeta) {
      return `${activeInterestMeta.emoji} ${activeInterestMeta.label} pack`;
    }
    if (scoutMode === "rarity" && activeRarityMeta) {
      return `${activeRarityMeta.emoji} ${activeRarityMeta.label} pack`;
    }
    if (scoutMode === "power" && activePowerMeta) {
      return `${activePowerMeta.emoji} ${activePowerMeta.label}`;
    }
    return "✨ Your scout pack";
  })();

  return (
    <div className="pi-scout">
      <div className="pi-hero">
        <h1 className="pi-hero__title">🔭 Scout — Find Your Next Card</h1>
        <p className="pi-hero__subtitle">
          Pick what you <strong>like</strong> — cards appear right below. Tap one to
          add to your watchlist!
          {typeof cashBalance === "number" && (
            <> You have <strong>{formatCurrency(cashBalance)}</strong> to spend.</>
          )}
        </p>
      </div>

      <section className="pi-scout__kid-finder">
        <h2 className="pi-scout__kid-title">🎯 Find cards your way</h2>
        <p className="pi-scout__kid-lead">
          Tap an interest, rarity, or power deck — your card pack pops open instantly!
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

        <div
          key={packPulse}
          ref={packRevealRef}
          className="pi-scout__pack-reveal pi-scout__pack-reveal--pop"
        >
          <div className="pi-scout__pack-head">
            <div>
              <h3 className="pi-scout__pack-title">{packTitle}</h3>
              <p className="pi-scout__pack-sub">
                {batch.length > 0
                  ? "Tap a card to pick it — stats load when you add to watchlist!"
                  : "No cards left in this pack — try another filter!"}
              </p>
            </div>
            <button
              type="button"
              className="pi-scout__shuffle pi-scout__shuffle--inline"
              onClick={() => refreshBatch(scoutMode)}
              disabled={loading || batch.length === 0}
            >
              🔄 New cards
            </button>
          </div>

          {batch.length > 0 ? (
            <div className="pi-scout__pack-scroll">
              {batch.map((company) => {
                const preview = toScoutPreviewCard(company, { rarity: previewRarity });
                const picked = selected?.ticker === company.ticker;
                return (
                  <div
                    key={company.ticker}
                    className={`pi-scout__pack-slot ${picked ? "pi-scout__pack-slot--picked" : ""}`}
                  >
                    <PokemonCard
                      card={preview}
                      variant="scout"
                      selected={picked}
                      onSelect={() => setSelected(company)}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="pi-scout__pack-empty">
              <span>🎉</span>
              <p>You&apos;ve scouted everything here — try a different pack!</p>
            </div>
          )}

          {selected && (
            <div className="pi-scout__pick-bar">
              <div className="pi-scout__pick-info">
                <span className="pi-scout__pick-emoji">{selected.emoji}</span>
                <div>
                  <strong>{selected.name}</strong>
                  <span className="pi-scout__pick-ticker">{selected.ticker}</span>
                  <p>{selected.hint}</p>
                </div>
              </div>
              <div className="pi-scout__pick-actions">
                {ownedSet.has(selected.ticker) ? (
                  <p className="pi-scout__status-msg">Already in your binder! 🃏</p>
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
            </div>
          )}
        </div>
      </section>

      <details className="pi-scout__advanced">
        <summary>🔎 Already know the company name? Search</summary>
        <div className="pi-scout__search-hero pi-scout__search-wrap">
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

        <div className="pi-scout__chip-row">
          <span className="pi-scout__chip-label">Filter by type:</span>
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
      </details>

      {error && <p className="error-msg">{error}</p>}

      <p className="pi-scout__remaining">
        {remaining} of {DISCOVERY_POOL.length} S&amp;P 500 companies left to scout
      </p>
    </div>
  );
}