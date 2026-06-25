"use client";

import type { GroupKey, SortKey } from "@/lib/portfolio";

interface CollectionFiltersProps {
  sortKey: SortKey;
  groupKey: GroupKey;
  onSortChange: (key: SortKey) => void;
  onGroupChange: (key: GroupKey) => void;
}

const GROUP_CHIPS: { key: GroupKey; label: string }[] = [
  { key: "none", label: "All" },
  { key: "type", label: "By Type" },
  { key: "sector", label: "By Sector" },
  { key: "rarity", label: "By Rarity" },
  { key: "evolution", label: "By Evolution" },
  { key: "ability", label: "Dividends" },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "value", label: "Value" },
  { key: "attack", label: "ATK" },
  { key: "price", label: "Price" },
  { key: "rarity", label: "Rarity" },
  { key: "name", label: "Name" },
];

export function CollectionFilters({
  sortKey,
  groupKey,
  onSortChange,
  onGroupChange,
}: CollectionFiltersProps) {
  return (
    <div className="pi-filters">
      <div className="pi-filters__chips">
        {GROUP_CHIPS.map((chip) => (
          <button
            key={chip.key}
            className={`pi-filters__chip ${groupKey === chip.key ? "pi-filters__chip--active" : ""}`}
            onClick={() => onGroupChange(chip.key)}
          >
            {chip.label}
          </button>
        ))}
      </div>
      <label className="pi-filters__sort">
        Sort
        <select
          value={sortKey}
          onChange={(e) => onSortChange(e.target.value as SortKey)}
          className="pi-filters__sort-menu"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.key} value={o.key}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}