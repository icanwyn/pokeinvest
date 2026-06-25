"use client";

import { useState } from "react";
import { login, register } from "@/lib/auth-client";
import type { UserBundle } from "@/types/user";
import { STARTING_CASH, LESSON_CASH_REWARD, MANUAL_LESSONS } from "@/lib/manual-lessons";

interface AuthScreenProps {
  onAuth: (user: UserBundle) => void;
}

export function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
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
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-logo">⚡ PokeInvest</span>
          <p>Learn investing like collecting Pokémon cards — with your own trainer account!</p>
        </div>

        <div className="auth-perks">
          <span>💵 ${STARTING_CASH.toLocaleString()} starting cash</span>
          <span>📚 {MANUAL_LESSONS.length} training lessons</span>
          <span>🎁 +${LESSON_CASH_REWARD} per lesson unlocked</span>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => setMode("login")}
          >
            Log in
          </button>
          <button
            type="button"
            className={mode === "register" ? "active" : ""}
            onClick={() => setMode("register")}
          >
            Create account
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
                placeholder="Ash Ketchum"
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
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading
              ? "Loading…"
              : mode === "login"
                ? "Enter the League →"
                : "Start your journey →"}
          </button>
        </form>
      </div>
    </div>
  );
}