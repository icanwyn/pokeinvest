"use client";

import { SECTOR_MAPPINGS } from "@/lib/mappings/sectors";
import { RARITY_TIERS } from "@/lib/mappings/rarity";
import { EVOLUTION_STAGES } from "@/lib/mappings/evolution";
import { formatMarketCap } from "@/lib/mappings/rarity";

export function FrameworkGuide() {
  return (
    <div className="framework-panel">
      <h3 className="panel-title">⚙️ PokeInvest Framework</h3>
      <p className="panel-subtitle">
        How stock data maps to Pokémon card stats — the teaching framework
      </p>

      <div className="framework-section">
        <h4>Stat Mapping</h4>
        <table className="framework-table">
          <thead>
            <tr>
              <th>Card Stat</th>
              <th>Stock Metric</th>
              <th>What It Teaches</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>HP (header)</td><td>Company health score</td><td>Higher = sturdier — cash, profits, manageable debt</td></tr>
            <tr><td>TKT</td><td>P/E Ratio</td><td>Ticket price for earnings — lower can be a bargain</td></tr>
            <tr><td>ATK</td><td>Revenue Growth</td><td>How aggressively the company is growing</td></tr>
            <tr><td>DEF</td><td>Debt/Equity</td><td>Financial defense against downturns</td></tr>
            <tr><td>SPD</td><td>Beta</td><td>How fast the price moves (volatility)</td></tr>
            <tr><td>SPC</td><td>Return on Equity</td><td>How smartly it uses money</td></tr>
            <tr><td>ACC</td><td>Profit Margin</td><td>Accuracy of turning sales into profit</td></tr>
          </tbody>
        </table>
      </div>

      <div className="framework-section">
        <h4>Sector → Pokémon Type</h4>
        <div className="sector-grid">
          {SECTOR_MAPPINGS.map((s) => (
            <div key={s.gicsSector} className="sector-chip" style={{ borderColor: s.color }}>
              <span>{s.icon}</span>
              <span>{s.gicsSector}</span>
              <span className="sector-type" style={{ color: s.color }}>{s.pokemonType}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="framework-section">
        <h4>Rarity Tiers (Market Cap)</h4>
        <div className="rarity-grid">
          {RARITY_TIERS.map((r) => (
            <div key={r.tier} className={`rarity-chip ${r.borderClass}`}>
              <span className="rarity-name">{r.label}</span>
              <span className="rarity-range">
                {formatMarketCap(r.minMarketCap)} – {r.maxMarketCap === Infinity ? "∞" : formatMarketCap(r.maxMarketCap)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="framework-section">
        <h4>Evolution Stages (Company Maturity)</h4>
        <div className="evolution-grid">
          {EVOLUTION_STAGES.map((e) => (
            <div key={e.stage} className="evolution-chip">
              <strong>{e.label}</strong>
              <span>{e.kidExplanation}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}