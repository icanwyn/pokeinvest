"use client";

import type { GroupKey, SortKey } from "@/lib/portfolio";

interface CollectionControlsProps {
  sortKey: SortKey;
  groupKey: GroupKey;
  cardCount: number;
  onSortChange: (key: SortKey) => void;
  onGroupChange: (key: GroupKey) => void;
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "value", label: "Portfolio Value" },
  { key: "attack", label: "ATK (Revenue Growth)" },
  { key: "type", label: "Pokémon Type" },
  { key: "sector", label: "Sector" },
  { key: "rarity", label: "Rarity" },
  { key: "evolution", label: "Evolution Stage" },
  { key: "price", label: "Stock Price" },
  { key: "quantity", label: "Shares Owned" },
  { key: "name", label: "Company Name" },
];

const GROUP_OPTIONS: { key: GroupKey; label: string }[] = [
  { key: "none", label: "Flat Grid" },
  { key: "type", label: "By Pokémon Type" },
  { key: "sector", label: "By Sector" },
  { key: "rarity", label: "By Rarity" },
  { key: "evolution", label: "By Evolution" },
  { key: "ability", label: "By Special Ability" },
];

export function CollectionControls({
  sortKey,
  groupKey,
  cardCount,
  onSortChange,
  onGroupChange,
}: CollectionControlsProps) {
  return (
    <div className="collection-controls">
      <div className="controls-row">
        <label className="control-label">
          Sort by
          <select
            value={sortKey}
            onChange={(e) => onSortChange(e.target.value as SortKey)}
            className="control-select"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="control-label">
          Arrange into
          <select
            value={groupKey}
            onChange={(e) => onGroupChange(e.target.value as GroupKey)}
            className="control-select"
          >
            {GROUP_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <span className="card-count-badge">
          {cardCount} card{cardCount !== 1 ? "s" : ""} in binder
        </span>
      </div>
    </div>
  );
}