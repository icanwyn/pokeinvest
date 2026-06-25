import type { RarityTier } from "@/types/card";

export interface RarityDefinition {
  tier: RarityTier;
  label: string;
  minMarketCap: number;
  maxMarketCap: number;
  borderClass: string;
  foilClass: string;
  sparkle: boolean;
  kidExplanation: string;
}

export const RARITY_TIERS: RarityDefinition[] = [
  {
    tier: "common",
    label: "Common",
    minMarketCap: 0,
    maxMarketCap: 300_000_000,
    borderClass: "border-common",
    foilClass: "",
    sparkle: false,
    kidExplanation:
      "A small company — like a common card you find in every pack!",
  },
  {
    tier: "uncommon",
    label: "Uncommon",
    minMarketCap: 300_000_000,
    maxMarketCap: 2_000_000_000,
    borderClass: "border-uncommon",
    foilClass: "",
    sparkle: false,
    kidExplanation:
      "A growing company — not rare, but worth keeping an eye on!",
  },
  {
    tier: "rare",
    label: "Rare ★",
    minMarketCap: 2_000_000_000,
    maxMarketCap: 10_000_000_000,
    borderClass: "border-rare",
    foilClass: "foil-subtle",
    sparkle: false,
    kidExplanation:
      "A big company worth billions — a Rare card in your collection!",
  },
  {
    tier: "holo-rare",
    label: "Holo Rare ★★",
    minMarketCap: 10_000_000_000,
    maxMarketCap: 100_000_000_000,
    borderClass: "border-holo",
    foilClass: "foil-holo",
    sparkle: true,
    kidExplanation:
      "A huge company — shiny Holo Rare, like Apple or Disney!",
  },
  {
    tier: "ultra-rare",
    label: "Ultra Rare ★★★",
    minMarketCap: 100_000_000_000,
    maxMarketCap: 1_000_000_000_000,
    borderClass: "border-ultra",
    foilClass: "foil-ultra",
    sparkle: true,
    kidExplanation:
      "A mega company worth hundreds of billions — Ultra Rare power!",
  },
  {
    tier: "secret-rare",
    label: "Secret Rare ✦",
    minMarketCap: 1_000_000_000_000,
    maxMarketCap: Infinity,
    borderClass: "border-secret",
    foilClass: "foil-secret",
    sparkle: true,
    kidExplanation:
      "The biggest companies on Earth — Secret Rare, the crown jewels!",
  },
];

export function getRarityFromMarketCap(marketCap: number): RarityDefinition {
  return (
    RARITY_TIERS.find(
      (t) => marketCap >= t.minMarketCap && marketCap < t.maxMarketCap
    ) ?? RARITY_TIERS[0]
  );
}

export function formatMarketCap(cap: number): string {
  if (cap >= 1_000_000_000_000) return `$${(cap / 1_000_000_000_000).toFixed(2)}T`;
  if (cap >= 1_000_000_000) return `$${(cap / 1_000_000_000).toFixed(1)}B`;
  if (cap >= 1_000_000) return `$${(cap / 1_000_000).toFixed(0)}M`;
  return `$${cap.toLocaleString()}`;
}