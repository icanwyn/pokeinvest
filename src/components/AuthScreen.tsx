"use client";

import { useState } from "react";
import { login, register } from "@/lib/auth-client";
import type { UserBundle } from "@/types/user";
import { STARTING_CASH, LESSON_CASH_REWARD, MANUAL_LESSONS } from "@/lib/manual-lessons";

interface AuthScreenProps {
  onAuth: (user: UserBundle) => void;
}

const FLOATING_CARDS = [
  { label: "Growth", emoji: "📈", rarity: "rare", delay: "0s" },
  { label: "Dividend", emoji: "💎", rarity: "epic", delay: "1.2s" },
  { label: "Index", emoji: "🌟", rarity: "common", delay: "2.4s" },
  { label: "Bond", emoji: "🛡️", rarity: "uncommon", delay: "0.8s" },
  { label: "ETF", emoji: "⚡", rarity: "legendary", delay: "1.8s" },
];

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user =
        mode === "login"
          ? await login(email, password)
          : await register(email, password, displayName);
      onAuth(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-layout">
        <section className="auth-hero" aria-label="Welcome to PokeInvest">
          <div className="auth-hero-scene" aria-hidden="true">
            {FLOATING_CARDS.map((card, i) => (
              <div
                key={card.label}
                className={`auth-float-card auth-float-card--${i + 1} auth-float-card--${card.rarity}`}
                style={{ animationDelay: card.delay }}
              >
                <span className="auth-float-card__emoji">{card.emoji}</span>
                <span className="auth-float-card__label">{card.label}</span>
                <span className="auth-float-card__shine" />
              </div>
            ))}
            <div className="auth-hero-glow auth-hero-glow--1" />
            <div className="auth-hero-glow auth-hero-glow--2" />
          </div>

          <div className="auth-hero-content">
            <span className="auth-badge">New trainers welcome!</span>
            <h1 className="auth-logo">
              <span className="auth-logo__bolt">⚡</span>
              PokeInvest
            </h1>
            <p className="auth-tagline">
              Catch stock cards, fill your binder, and level up your money skills —
              just like building the ultimate card collection!
            </p>

            <ul className="auth-perks">
              <li className="auth-perk">
                <span className="auth-perk__icon">💵</span>
                <div>
                  <strong>${STARTING_CASH.toLocaleString()} starter pack</strong>
                  <span>Jump in with trainer cash on day one</span>
                </div>
              </li>
              <li className="auth-perk">
                <span className="auth-perk__icon">📚</span>
                <div>
                  <strong>{MANUAL_LESSONS.length} training lessons</strong>
                  <span>Learn investing one card at a time</span>
                </div>
              </li>
              <li className="auth-perk">
                <span className="auth-perk__icon">🎁</span>
                <div>
                  <strong>+${LESSON_CASH_REWARD} per lesson</strong>
                  <span>Earn rewards as you complete each quest</span>
                </div>
              </li>
              <li className="auth-perk">
                <span className="auth-perk__icon">📒</span>
                <div>
                  <strong>Your own binder</strong>
                  <span>Track holdings like a real collector</span>
                </div>
              </li>
            </ul>

            <p className="auth-hero-footnote">
              Free to join · Kid-friendly · Grown-up smart
            </p>
          </div>
        </section>

        <section className="auth-panel" aria-label="Sign in or create account">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2 className="auth-card-title">
                {mode === "register" ? "Start your journey" : "Welcome back, trainer"}
              </h2>
              <p className="auth-card-subtitle">
                {mode === "register"
                  ? "Create your trainer account and open your first binder page."
                  : "Log in to check your portfolio and keep collecting."}
              </p>
            </div>

            <div className="auth-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === "register"}
                className={mode === "register" ? "active" : ""}
                onClick={() => setMode("register")}
              >
                Create account
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "login"}
                className={mode === "login" ? "active" : ""}
                onClick={() => setMode("login")}
              >
                Log in
              </button>
            </div>

            <form className="auth-form" onSubmit={submit}>
              {mode === "register" && (
                <label>
                  Trainer name
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="CardMaster42"
                    autoComplete="nickname"
                  />
                </label>
              )}
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="trainer@example.com"
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="At least 6 characters"
                />
              </label>

              {error && <p className="auth-error" role="alert">{error}</p>}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? (
                  <span className="auth-loading">Catching cards…</span>
                ) : mode === "login" ? (
                  "Enter the League →"
                ) : (
                  "Catch your first card →"
                )}
              </button>
            </form>

            {mode === "register" && (
              <p className="auth-card-footnote">
                Join thousands of trainers learning to invest the fun way.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}