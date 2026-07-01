"use client";

import { useState } from "react";
import { login, register } from "@/lib/auth-client";
import type { UserBundle } from "@/types/user";
import { STARTING_CASH, LESSON_CASH_REWARD, MANUAL_LESSONS, maxLessonXp } from "@/lib/manual-lessons";

interface AuthScreenProps {
  onAuth: (user: UserBundle) => void;
}

const FLOATING_CARDS = [
  { label: "Apple", emoji: "🍎", rarity: "rare", delay: "0s" },
  { label: "Nike", emoji: "👟", rarity: "epic", delay: "1.2s" },
  { label: "Tesla", emoji: "🚗", rarity: "legendary", delay: "2.4s" },
  { label: "Disney", emoji: "🏰", rarity: "uncommon", delay: "0.8s" },
  { label: "Nvidia", emoji: "🎮", rarity: "common", delay: "1.8s" },
];

const STEPS = [
  { icon: "📖", title: "Learn", text: "Quick tips — easy words, no boring lectures" },
  { icon: "🎯", title: "Quiz", text: "10 questions. Miss one? We teach it again" },
  { icon: "💵", title: "Earn", text: "Win coins + XP like a real game" },
  { icon: "📒", title: "Collect", text: "Fill your binder with company cards" },
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

  const scrollToSignup = () => {
    document.getElementById("auth-signup")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMode("register");
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
            <span className="auth-badge">Free · Made for kids · Super fun</span>
            <h1 className="auth-logo">
              <span className="auth-logo__bolt">⚡</span>
              PokeInvest
            </h1>
            <p className="auth-tagline">
              <strong>Collect company cards. Learn money. Level up.</strong>
              <br />
              It&apos;s like a Pokémon game — but you build real investing skills!
            </p>

            <button type="button" className="auth-hero-cta" onClick={scrollToSignup}>
              Start free →
            </button>

            <div className="auth-steps">
              {STEPS.map((step) => (
                <div className="auth-step" key={step.title}>
                  <span className="auth-step__icon">{step.icon}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <span>{step.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <ul className="auth-perks">
              <li className="auth-perk">
                <span className="auth-perk__icon">💵</span>
                <div>
                  <strong>${STARTING_CASH.toLocaleString()} to start</strong>
                  <span>Play with trainer coins on day one</span>
                </div>
              </li>
              <li className="auth-perk">
                <span className="auth-perk__icon">📚</span>
                <div>
                  <strong>{MANUAL_LESSONS.length} fun lessons</strong>
                  <span>Small bites + quizzes — not long reading</span>
                </div>
              </li>
              <li className="auth-perk">
                <span className="auth-perk__icon">🎁</span>
                <div>
                  <strong>+${LESSON_CASH_REWARD} every lesson</strong>
                  <span>Up to {maxLessonXp()} XP if you ace the quiz</span>
                </div>
              </li>
            </ul>

            <p className="auth-hero-footnote">
              No credit card · Safe for ages 8+ · Learn at your own pace
            </p>
          </div>
        </section>

        <section className="auth-panel" id="auth-signup" aria-label="Sign in or create account">
          <div className="auth-card">
            <div className="auth-card-header">
              <h2 className="auth-card-title">
                {mode === "register" ? "Join the league!" : "Welcome back!"}
              </h2>
              <p className="auth-card-subtitle">
                {mode === "register"
                  ? "Pick a trainer name. Get your binder. Catch your first card."
                  : "Log in and check your binder + coins."}
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
                Sign up free
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
                    placeholder="Pick a cool name"
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
                  placeholder="you@email.com"
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
                  placeholder="6+ characters"
                />
              </label>

              {error && (
                <p className="auth-error" role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? (
                  <span className="auth-loading">Loading…</span>
                ) : mode === "login" ? (
                  "Log in →"
                ) : (
                  "Create my account →"
                )}
              </button>
            </form>

            {mode === "register" && (
              <p className="auth-card-footnote">
                🃏 Your first company card is waiting inside.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}