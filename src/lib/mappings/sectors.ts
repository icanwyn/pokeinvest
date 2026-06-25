import type { PokemonType } from "@/types/card";

export interface SectorMapping {
  gicsSector: string;
  pokemonType: PokemonType;
  color: string;
  icon: string;
  kidExplanation: string;
}

export const SECTOR_MAPPINGS: SectorMapping[] = [
  {
    gicsSector: "Energy",
    pokemonType: "fire",
    color: "#E25822",
    icon: "🔥",
    kidExplanation:
      "Energy companies dig up oil and gas — like Fire Pokémon that fuel everything!",
  },
  {
    gicsSector: "Materials",
    pokemonType: "steel",
    color: "#B8B8D0",
    icon: "⚙️",
    kidExplanation:
      "Materials companies make metals and chemicals — tough like Steel types!",
  },
  {
    gicsSector: "Industrials",
    pokemonType: "fighting",
    color: "#C03028",
    icon: "💪",
    kidExplanation:
      "Industrials build planes, trains, and machines — hardworking Fighting types!",
  },
  {
    gicsSector: "Consumer Discretionary",
    pokemonType: "normal",
    color: "#A8A878",
    icon: "🛍️",
    kidExplanation:
      "These sell toys, cars, and fun stuff — everyday Normal types everyone uses!",
  },
  {
    gicsSector: "Consumer Staples",
    pokemonType: "grass",
    color: "#78C850",
    icon: "🌿",
    kidExplanation:
      "Staples sell food and soap — essential like Grass types that keep us healthy!",
  },
  {
    gicsSector: "Health Care",
    pokemonType: "fairy",
    color: "#EE99AC",
    icon: "💊",
    kidExplanation:
      "Health Care heals people — caring Fairy types that protect us!",
  },
  {
    gicsSector: "Financials",
    pokemonType: "psychic",
    color: "#F85888",
    icon: "🏦",
    kidExplanation:
      "Banks and insurers manage money — smart Psychic types who see the future!",
  },
  {
    gicsSector: "Information Technology",
    pokemonType: "electric",
    color: "#F8D030",
    icon: "⚡",
    kidExplanation:
      "Tech companies build phones and apps — fast Electric types that power the world!",
  },
  {
    gicsSector: "Communication Services",
    pokemonType: "psychic",
    color: "#6890F0",
    icon: "📡",
    kidExplanation:
      "Media and telecom connect people — Psychic types that share ideas everywhere!",
  },
  {
    gicsSector: "Utilities",
    pokemonType: "water",
    color: "#6890F0",
    icon: "💧",
    kidExplanation:
      "Utilities bring water and electricity — steady Water types that flow to every home!",
  },
  {
    gicsSector: "Real Estate",
    pokemonType: "dragon",
    color: "#7038F8",
    icon: "🏠",
    kidExplanation:
      "Real estate owns buildings and land — powerful Dragon types guarding treasure!",
  },
];

export function getSectorMapping(sector: string): SectorMapping {
  const match = SECTOR_MAPPINGS.find(
    (s) => s.gicsSector.toLowerCase() === sector.toLowerCase()
  );
  return (
    match ?? {
      gicsSector: sector || "Unknown",
      pokemonType: "normal",
      color: "#A8A878",
      icon: "❓",
      kidExplanation: "A unique company that doesn't fit one type!",
    }
  );
}