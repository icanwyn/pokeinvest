"use client";

import { useCallback, useEffect, useState } from "react";
import { formatCurrency } from "@/lib/formatters";

interface LeaderboardRow {
  userId: string;
  displayName: string;
  cashBalance: number;
  portfolioValue: number;
  totalFunds: number;
  xp: number;
  holdingsCount: number;
}

interface LeagueSummary {
  id: string;
  name: string;
  inviteCode: string;
  createdBy?: string;
  memberCount: number;
}

export function LeaderboardView() {
  const [tab, setTab] = useState<"global" | "private">("global");
  const [globalBoard, setGlobalBoard] = useState<LeaderboardRow[]>([]);
  const [leagues, setLeagues] = useState<LeagueSummary[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<string | null>(null);
  const [privateBoard, setPrivateBoard] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leagueName, setLeagueName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [createdInvite, setCreatedInvite] = useState<string | null>(null);

  const loadGlobal = useCallback(async () => {
    const res = await fetch("/api/leaderboard/global");
    const data = await res.json();
    setGlobalBoard(data.leaderboard ?? []);
  }, []);

  const loadLeagues = useCallback(async () => {
    const res = await fetch("/api/leagues");
    if (!res.ok) return;
    const data = await res.json();
    setLeagues(data.leagues ?? []);
    if (data.leagues?.length && !selectedLeagueId) {
      setSelectedLeagueId(data.leagues[0].id);
    }
  }, [selectedLeagueId]);

  const loadPrivateBoard = useCallback(async (leagueId: string) => {
    const res = await fetch(`/api/leagues/${leagueId}/leaderboard`);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Could not load league");
      return;
    }
    const data = await res.json();
    setPrivateBoard(data.leaderboard ?? []);
    setError(null);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await Promise.all([loadGlobal(), loadLeagues()]);
      setLoading(false);
    })();
  }, [loadGlobal, loadLeagues]);

  useEffect(() => {
    if (selectedLeagueId && tab === "private") {
      loadPrivateBoard(selectedLeagueId);
    }
  }, [selectedLeagueId, tab, loadPrivateBoard]);

  const createLeague = async () => {
    setError(null);
    const res = await fetch("/api/leagues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: leagueName }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not create league");
      return;
    }
    setCreatedInvite(data.league.inviteCode);
    setLeagueName("");
    await loadLeagues();
    setSelectedLeagueId(data.league.id);
    setTab("private");
  };

  const joinLeague = async () => {
    setError(null);
    const res = await fetch("/api/leagues/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteCode }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not join league");
      return;
    }
    setInviteCode("");
    await loadLeagues();
    setSelectedLeagueId(data.league.id);
    setTab("private");
  };

  const board = tab === "global" ? globalBoard : privateBoard;

  return (
    <div className="leaderboard-view">
      <div className="leaderboard-header">
        <h2>🏆 Leaderboards</h2>
        <p>Ranked by total funds — cash plus portfolio value.</p>
      </div>

      <div className="leaderboard-tabs">
        <button
          type="button"
          className={tab === "global" ? "active" : ""}
          onClick={() => setTab("global")}
        >
          🌍 Global Top 10
        </button>
        <button
          type="button"
          className={tab === "private" ? "active" : ""}
          onClick={() => setTab("private")}
        >
          👨‍👩‍👧‍👦 Family & Friends
        </button>
      </div>

      {tab === "private" && (
        <div className="league-controls">
          <div className="league-panel">
            <h4>Create a private league</h4>
            <div className="league-row">
              <input
                type="text"
                placeholder="Huynh Family League"
                value={leagueName}
                onChange={(e) => setLeagueName(e.target.value)}
              />
              <button type="button" onClick={createLeague}>
                Create
              </button>
            </div>
            {createdInvite && (
              <p className="league-invite-created">
                Share this invite code: <strong>{createdInvite}</strong>
              </p>
            )}
          </div>
          <div className="league-panel">
            <h4>Join with invite code</h4>
            <div className="league-row">
              <input
                type="text"
                placeholder="ABC123"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              />
              <button type="button" onClick={joinLeague}>
                Join
              </button>
            </div>
          </div>
          {leagues.length > 0 && (
            <div className="league-select">
              <label>
                Your leagues
                <select
                  value={selectedLeagueId ?? ""}
                  onChange={(e) => setSelectedLeagueId(e.target.value)}
                >
                  {leagues.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.memberCount} trainers) — {l.inviteCode}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>
      )}

      {error && <p className="leaderboard-error">{error}</p>}

      {loading ? (
        <p className="leaderboard-loading">Loading rankings…</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Trainer</th>
              <th>Total</th>
              <th>Cash</th>
              <th>Portfolio</th>
              <th>Cards</th>
            </tr>
          </thead>
          <tbody>
            {board.length === 0 ? (
              <tr>
                <td colSpan={6} className="leaderboard-empty">
                  {tab === "private"
                    ? "Create or join a league to compete with family & friends!"
                    : "No trainers yet — be the first!"}
                </td>
              </tr>
            ) : (
              board.map((row, i) => (
                <tr key={row.userId}>
                  <td>{i + 1}</td>
                  <td>{row.displayName}</td>
                  <td className="leaderboard-total">{formatCurrency(row.totalFunds)}</td>
                  <td>{formatCurrency(row.cashBalance)}</td>
                  <td>{formatCurrency(row.portfolioValue)}</td>
                  <td>{row.holdingsCount}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}