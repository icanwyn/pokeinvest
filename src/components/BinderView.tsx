"use client";

import { CardGrid } from "@/components/CardGrid";
import { CollectionFilters } from "@/components/CollectionFilters";
import type { CardGroup } from "@/lib/portfolio";
import type { GroupKey, SortKey } from "@/lib/portfolio";

export type BinderTab = "watchlist" | "portfolio";

interface BinderViewProps {
  binderTab: BinderTab;
  onBinderTabChange: (tab: BinderTab) => void;
  portfolioGroups: CardGroup[];
  watchlistGroups: CardGroup[];
  portfolioCount: number;
  watchlistCount: number;
  sortKey: SortKey;
  groupKey: GroupKey;
  selectedTicker: string | null;
  onSortChange: (key: SortKey) => void;
  onGroupChange: (key: GroupKey) => void;
  onSelect: (ticker: string) => void;
  onRemoveFromPortfolio: (ticker: string) => void;
  onRemoveFromWatchlist: (ticker: string) => void;
  onQuantityChange: (ticker: string, qty: number) => void;
  onGoScout: () => void;
  binderSearch: string;
  onBinderSearchChange: (q: string) => void;
}

function filterGroups(groups: CardGroup[], search: string): CardGroup[] {
  return groups
    .map((g) => ({
      ...g,
      holdings: g.holdings.filter(
        (h) =>
          !search ||
          h.ticker.includes(search.toUpperCase()) ||
          h.companyName.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter((g) => g.holdings.length > 0);
}

export function BinderView({
  binderTab,
  onBinderTabChange,
  portfolioGroups,
  watchlistGroups,
  portfolioCount,
  watchlistCount,
  sortKey,
  groupKey,
  selectedTicker,
  onSortChange,
  onGroupChange,
  onSelect,
  onRemoveFromPortfolio,
  onRemoveFromWatchlist,
  onQuantityChange,
  onGoScout,
  binderSearch,
  onBinderSearchChange,
}: BinderViewProps) {
  const isWatchlist = binderTab === "watchlist";
  const cardCount = isWatchlist ? watchlistCount : portfolioCount;
  const groups = filterGroups(
    isWatchlist ? watchlistGroups : portfolioGroups,
    binderSearch
  );

  const bothEmpty = portfolioCount === 0 && watchlistCount === 0;

  if (bothEmpty) {
    return (
      <div className="pi-binder">
        <div className="pi-hero">
          <h1 className="pi-hero__title">🃏 My Binder</h1>
          <p className="pi-hero__subtitle">Research cards first, catch them when you&apos;re ready!</p>
        </div>
        <div className="pi-binder__empty">
          <span className="empty-icon">👀</span>
          <h2>Your binder is empty!</h2>
          <p>Head to Scout to add companies to your watchlist and learn about them.</p>
          <button className="add-btn" onClick={onGoScout}>
            🔭 Go Scout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pi-binder">
      <div className="pi-hero pi-hero--row">
        <div>
          <h1 className="pi-hero__title">🃏 My Binder</h1>
          <p className="pi-hero__subtitle">
            {isWatchlist
              ? "Study cards on your watchlist — catch when you're ready to own"
              : "Your caught cards — stocks you own in your binder"}
          </p>
        </div>
        <input
          type="text"
          placeholder={isWatchlist ? "Search watchlist..." : "Search portfolio..."}
          value={binderSearch}
          onChange={(e) => onBinderSearchChange(e.target.value)}
          className="pi-hero__search"
        />
      </div>

      <div className="pi-binder__tabs">
        <button
          type="button"
          className={`pi-binder__tab ${binderTab === "portfolio" ? "pi-binder__tab--active" : ""}`}
          onClick={() => onBinderTabChange("portfolio")}
        >
          🃏 My Binder
          {portfolioCount > 0 && (
            <span className="pi-binder__tab-count">{portfolioCount}</span>
          )}
        </button>
        <button
          type="button"
          className={`pi-binder__tab ${binderTab === "watchlist" ? "pi-binder__tab--active" : ""}`}
          onClick={() => onBinderTabChange("watchlist")}
        >
          👀 Watchlist
          {watchlistCount > 0 && (
            <span className="pi-binder__tab-count">{watchlistCount}</span>
          )}
        </button>
      </div>

      {cardCount === 0 ? (
        <div className="pi-binder__empty pi-binder__empty--inline">
          <span className="empty-icon">{isWatchlist ? "👀" : "🎯"}</span>
          <h2>{isWatchlist ? "No cards on your watchlist yet" : "No caught stocks yet"}</h2>
          <p>
            {isWatchlist
              ? "Scout companies and add them here to learn before you buy."
              : "When you're ready, catch a stock from your watchlist or Scout!"}
          </p>
          <button className="add-btn" onClick={onGoScout}>
            🔭 Go Scout
          </button>
        </div>
      ) : (
        <>
          <CollectionFilters
            sortKey={sortKey}
            groupKey={groupKey}
            onSortChange={onSortChange}
            onGroupChange={onGroupChange}
          />

          <div className="pi-binder__grid-wrap">
            <CardGrid
              groups={groups}
              variant={isWatchlist ? "watchlist" : "portfolio"}
              selectedTicker={selectedTicker}
              onSelect={onSelect}
              onRemove={
                isWatchlist ? onRemoveFromWatchlist : onRemoveFromPortfolio
              }
              onQuantityChange={isWatchlist ? undefined : onQuantityChange}
            />
            <button className="pi-binder__empty-slot" onClick={onGoScout}>
              <span className="pi-binder__empty-slot-icon">+</span>
              <span>{isWatchlist ? "Scout More" : "Catch New Card"}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}