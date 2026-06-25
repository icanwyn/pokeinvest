"use client";

import type { ReactNode } from "react";
import { formatCurrency } from "@/lib/formatters";

export type AppView = "binder" | "adventure" | "scout" | "leaderboard" | "coach";

interface AppShellProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  children: ReactNode;
  portfolioPill?: ReactNode;
  userName?: string;
  cashBalance?: number;
  totalFunds?: number;
  onLogout?: () => void;
}

const NAV_ITEMS: { key: AppView; label: string; icon: string; mobileLabel: string }[] = [
  { key: "binder", label: "My Binder", icon: "🃏", mobileLabel: "Binder" },
  { key: "adventure", label: "Manual", icon: "📖", mobileLabel: "Learn" },
  { key: "scout", label: "Scout", icon: "🔭", mobileLabel: "Scout" },
  { key: "leaderboard", label: "Ranks", icon: "🏆", mobileLabel: "Ranks" },
  { key: "coach", label: "Coach", icon: "⚙️", mobileLabel: "Coach" },
];

export function AppShell({
  activeView,
  onViewChange,
  children,
  portfolioPill,
  userName,
  cashBalance,
  totalFunds,
  onLogout,
}: AppShellProps) {
  return (
    <div className="pi-app">
      <header className="pi-app__header">
        <div className="pi-app__brand">
          <span className="pi-app__logo">
            ⚡ PokeInvest
            {process.env.NEXT_PUBLIC_BETA === "true" && (
              <span className="pi-app__beta">Beta</span>
            )}
          </span>
          {userName && (
            <span className="pi-app__user">
              {userName}
              {typeof cashBalance === "number" && (
                <span className="pi-app__cash">{formatCurrency(cashBalance)}</span>
              )}
            </span>
          )}
        </div>

        <nav className="pi-app__nav pi-app__nav--desktop">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`pi-app__nav-item ${activeView === item.key ? "pi-app__nav-item--active" : ""}`}
              onClick={() => onViewChange(item.key)}
            >
              {item.icon} {item.label}
            </button>
          ))}
          {onLogout && (
            <button type="button" className="pi-app__logout" onClick={onLogout}>
              Log out
            </button>
          )}
        </nav>
      </header>

      {portfolioPill}

      {typeof totalFunds === "number" && activeView === "binder" && (
        <div className="pi-app__net-worth-mobile">
          Net {formatCurrency(totalFunds)}
        </div>
      )}

      <main className="pi-app__main">{children}</main>

      <nav className="pi-app__bottom-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`pi-bottom-nav-item ${activeView === item.key ? "pi-bottom-nav-item--active" : ""}`}
            onClick={() => onViewChange(item.key)}
          >
            <span className="pi-bottom-nav-icon">{item.icon}</span>
            <span className="pi-bottom-nav-label">{item.mobileLabel}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}