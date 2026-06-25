import type { StockCard } from "@/types/card";

/**
 * Prompt templates for Grok Imagine image_gen.
 * Use these to generate Pokemon-style company card artwork.
 * Per Imagine skill: generate base image first, then image_edit for consistency.
 */
export const AVATAR_PROMPT_TEMPLATES = {
  base: (card: StockCard) =>
    `A Pokemon trading card illustration for ${card.companyName} (${card.ticker}). ` +
    `Classic Pokemon card golden border, cream background. Center art shows a stylized ` +
    `${card.sector} themed mascot creature in vibrant anime Pokemon art style. ` +
    `${card.pokemonType} type energy effects. Holographic foil shimmer. ` +
    `Kid-friendly collectible card game aesthetic, bright colors.`,

  sectorMascot: (sector: string, type: string) =>
    `A cute Pokemon-style creature mascot representing the ${sector} industry. ` +
    `${type} type elemental powers. Friendly expression, dynamic pose, ` +
    `anime illustration style on transparent-friendly background.`,

  logoFusion: (companyName: string, ticker: string) =>
    `Pokemon card art frame with abstract geometric shapes inspired by ` +
    `${companyName} branding colors. ${ticker} ticker subtly integrated. ` +
    `Trading card game illustration, no copyrighted logos.`,

  holoRare: (card: StockCard) =>
    `Ultra rare holographic Pokemon card featuring ${card.companyName}. ` +
    `Rainbow foil effect, golden secret rare border, sparkles. ` +
    `${card.pokemonType} type energy aura. Premium collectible aesthetic.`,

  evolution: (card: StockCard, stage: string) =>
    `${card.companyName} as a ${stage} evolution stage Pokemon creature. ` +
    `More powerful and detailed than basic form. ${card.pokemonType} type. ` +
    `Trading card center art, dynamic battle-ready pose.`,
};

export function getSectorEmoji(type: string): string {
  const map: Record<string, string> = {
    fire: "🔥",
    water: "💧",
    grass: "🌿",
    electric: "⚡",
    psychic: "🔮",
    fighting: "👊",
    steel: "⚙️",
    fairy: "✨",
    dark: "🌑",
    normal: "⭐",
    dragon: "🐉",
  };
  return map[type] ?? "⭐";
}