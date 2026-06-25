"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AppShell, type AppView } from "@/components/AppShell";
import { AuthScreen } from "@/components/AuthScreen";
import { BinderView, type BinderTab } from "@/components/BinderView";
import { ScoutView } from "@/components/ScoutView";
import { CardDetailDrawer } from "@/components/CardDetailDrawer";
import { LessonPanel } from "@/components/LessonPanel";
import { LeaderboardView } from "@/components/LeaderboardView";
import { FrameworkGuide } from "@/components/FrameworkGuide";
import { PortfolioStrip } from "@/components/PortfolioStrip";
import { fetchMe, logout } from "@/lib/auth-client";
import { formatCurrency } from "@/lib/formatters";
import {
  sortHoldings,
  groupHoldings,
  computePortfolioStats,
  type SortKey,
  type GroupKey,
} from "@/lib/portfolio";
import type { PortfolioHolding, StockCard } from "@/types/card";
import { LESSON_CASH_REWARD } from "@/lib/manual-lessons";
import type { UserBundle } from "@/types/user";

async function fetchStockCard(symbol: string): Promise<StockCard> {
  const res = await fetch(`/api/stock/${symbol}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Failed to fetch");
  }
  return data;
}

export function PokeInvestApp() {
  const [user, setUser] = useState<UserBundle | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState<string | null>(null);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<AppView>("binder");
  const [binderTab, setBinderTab] = useState<BinderTab>("watchlist");
  const [sortKey, setSortKey] = useState<SortKey>("value");
  const [groupKey, setGroupKey] = useState<GroupKey>("none");
  const [binderSearch, setBinderSearch] = useState("");

  const holdings = user?.holdings ?? [];
  const watchlist = user?.watchlist ?? [];

  useEffect(() => {
    fetchMe()
      .then(setUser)
      .finally(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    if (!celebrate) return;
    const t = setTimeout(() => setCelebrate(null), 5000);
    return () => clearTimeout(t);
  }, [celebrate]);

  const selectedHolding =
    holdings.find((h) => h.ticker === selectedTicker) ?? null;
  const selectedWatch =
    watchlist.find((c) => c.ticker === selectedTicker) ?? null;

  const portfolioStats = useMemo(() => computePortfolioStats(holdings), [holdings]);

  const portfolioGroups = useMemo(() => {
    const sorted = sortHoldings(holdings, sortKey);
    return groupHoldings(sorted, groupKey);
  }, [holdings, sortKey, groupKey]);

  const watchlistAsHoldings = useMemo(
    (): PortfolioHolding[] => watchlist.map((c) => ({ ...c, quantity: 0 })),
    [watchlist]
  );

  const watchlistGroups = useMemo(() => {
    const sorted = sortHoldings(
      watchlistAsHoldings,
      sortKey === "value" ? "price" : sortKey
    );
    return groupHoldings(sorted, groupKey);
  }, [watchlistAsHoldings, sortKey, groupKey]);

  const addToWatchlist = useCallback(
    async (symbol: string) => {
      if (!user) return;
      const sym = symbol.trim().toUpperCase();
      if (!sym) return;

      if (holdings.some((h) => h.ticker === sym)) {
        setError(`${sym} is already in your portfolio!`);
        return;
      }

      if (watchlist.some((c) => c.ticker === sym)) {
        setSelectedTicker(sym);
        setBinderTab("watchlist");
        setActiveView("binder");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchStockCard(sym);
        const res = await fetch("/api/user/watchlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ card: data }),
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "Failed to save watchlist");
        setUser(body.user);
        setSelectedTicker(sym);
        setBinderTab("watchlist");
        setActiveView("binder");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [user, holdings, watchlist]
  );

  const purchaseToPortfolio = useCallback(
    async (symbol: string) => {
      if (!user) return;
      const sym = symbol.trim().toUpperCase();
      if (!sym) return;

      if (holdings.some((h) => h.ticker === sym)) {
        setError(`${sym} is already in your portfolio!`);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const existing = watchlist.find((c) => c.ticker === sym);
        const data = existing ?? (await fetchStockCard(sym));
        const res = await fetch("/api/user/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ card: data, quantity: 1 }),
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error ?? "Purchase failed");
        setUser(body.user);
        setSelectedTicker(sym);
        setBinderTab("portfolio");
        setActiveView("binder");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [user, holdings, watchlist]
  );

  const removeFromWatchlist = useCallback(
    async (symbol: string) => {
      if (!user) return;
      const res = await fetch(`/api/user/watchlist?ticker=${symbol}`, {
        method: "DELETE",
      });
      const body = await res.json();
      if (res.ok) setUser(body.user);
      setSelectedTicker(null);
    },
    [user]
  );

  const removeFromPortfolio = useCallback(
    async (symbol: string) => {
      if (!user) return;
      const res = await fetch(`/api/user/portfolio?ticker=${symbol}`, {
        method: "DELETE",
      });
      const body = await res.json();
      if (res.ok) setUser(body.user);
      setSelectedTicker(null);
    },
    [user]
  );

  const updateQuantity = useCallback(
    async (symbol: string, quantity: number) => {
      if (!user) return;
      const holding = holdings.find((h) => h.ticker === symbol);
      const res = await fetch("/api/user/portfolio", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: symbol,
          quantity,
          card: holding,
        }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError(body.error ?? "Could not update quantity");
        return;
      }
      setUser(body.user);
    },
    [user, holdings]
  );

  const refreshCard = useCallback(
    async (symbol: string, source: "watchlist" | "portfolio") => {
      if (!user) return;
      setLoading(true);
      try {
        const data = await fetchStockCard(symbol);
        if (source === "portfolio") {
          const holding = holdings.find((h) => h.ticker === symbol);
          const res = await fetch("/api/user/portfolio", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ticker: symbol,
              quantity: holding?.quantity ?? 1,
              card: data,
            }),
          });
          const body = await res.json();
          if (res.ok) setUser(body.user);
        } else {
          const res = await fetch("/api/user/watchlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ card: data }),
          });
          const body = await res.json();
          if (res.ok) setUser(body.user);
        }
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    },
    [user, holdings]
  );

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setSelectedTicker(null);
  };

  const trackedTickers = useMemo(
    () => [...holdings.map((h) => h.ticker), ...watchlist.map((c) => c.ticker)],
    [holdings, watchlist]
  );

  if (authLoading) {
    return (
      <div className="auth-screen">
        <p className="auth-loading">Loading trainer data…</p>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuth={setUser} />;
  }

  const portfolioPill =
    activeView !== "binder" ? (
      <div className="pi-wallet-strip">
        <span className="pi-wallet-cash">💵 {formatCurrency(user.cashBalance)}</span>
        <span className="pi-wallet-total">Net {formatCurrency(user.totalFunds)}</span>
        {holdings.length > 0 && <PortfolioStrip stats={portfolioStats} compact />}
      </div>
    ) : null;

  return (
    <AppShell
      activeView={activeView}
      onViewChange={(v) => {
        setActiveView(v);
        setError(null);
      }}
      portfolioPill={portfolioPill}
      userName={user.displayName}
      cashBalance={user.cashBalance}
      totalFunds={user.totalFunds}
      onLogout={handleLogout}
    >
      {celebrate && <div className="pi-celebrate">{celebrate}</div>}

      {activeView === "binder" && (
        <>
          <div className="pi-binder-wallet">
            <span>💵 Cash: <strong>{formatCurrency(user.cashBalance)}</strong></span>
            <span>📊 Net worth: <strong>{formatCurrency(user.totalFunds)}</strong></span>
          </div>
          {holdings.length > 0 && binderTab === "portfolio" && (
            <PortfolioStrip stats={portfolioStats} />
          )}
          <BinderView
            binderTab={binderTab}
            onBinderTabChange={setBinderTab}
            portfolioGroups={portfolioGroups}
            watchlistGroups={watchlistGroups}
            portfolioCount={holdings.length}
            watchlistCount={watchlist.length}
            sortKey={sortKey}
            groupKey={groupKey}
            selectedTicker={selectedTicker}
            onSortChange={setSortKey}
            onGroupChange={setGroupKey}
            onSelect={setSelectedTicker}
            onRemoveFromPortfolio={removeFromPortfolio}
            onRemoveFromWatchlist={removeFromWatchlist}
            onQuantityChange={updateQuantity}
            onGoScout={() => setActiveView("scout")}
            binderSearch={binderSearch}
            onBinderSearchChange={setBinderSearch}
          />
        </>
      )}

      {activeView === "scout" && (
        <ScoutView
          trackedTickers={trackedTickers}
          watchedTickers={watchlist.map((c) => c.ticker)}
          ownedTickers={holdings.map((h) => h.ticker)}
          onAddToWatchlist={addToWatchlist}
          onPurchase={purchaseToPortfolio}
          loading={loading}
          error={error}
          cashBalance={user.cashBalance}
        />
      )}

      {activeView === "adventure" && (
        <div className="pi-adventure">
          <div className="pi-hero">
            <h1 className="pi-hero__title">📖 Training Manual</h1>
            <p className="pi-hero__subtitle">
              Unlock lessons in order — earn ${LESSON_CASH_REWARD} and XP for each quiz you ace!
            </p>
          </div>
          <LessonPanel
            user={user}
            onUserUpdate={setUser}
            onCelebrate={setCelebrate}
          />
        </div>
      )}

      {activeView === "leaderboard" && <LeaderboardView />}

      {activeView === "coach" && (
        <div className="pi-coach">
          <div className="pi-hero">
            <h1 className="pi-hero__title">⚙️ Coach — Parent Guide</h1>
            <p className="pi-hero__subtitle">Framework reference for teaching your young trainers</p>
          </div>
          <FrameworkGuide />
        </div>
      )}

      {selectedHolding && (
        <CardDetailDrawer
          mode="portfolio"
          holding={selectedHolding}
          onClose={() => setSelectedTicker(null)}
          onRefresh={() => refreshCard(selectedHolding.ticker, "portfolio")}
          onQuantityChange={(qty) => updateQuantity(selectedHolding.ticker, qty)}
          onRemove={() => removeFromPortfolio(selectedHolding.ticker)}
          loading={loading}
        />
      )}

      {!selectedHolding && selectedWatch && (
        <CardDetailDrawer
          mode="watchlist"
          holding={{ ...selectedWatch, quantity: 0 }}
          onClose={() => setSelectedTicker(null)}
          onRefresh={() => refreshCard(selectedWatch.ticker, "watchlist")}
          onPurchase={() => purchaseToPortfolio(selectedWatch.ticker)}
          onRemove={() => removeFromWatchlist(selectedWatch.ticker)}
          loading={loading}
          cashBalance={user.cashBalance}
        />
      )}
    </AppShell>
  );
}