import type { EvolutionStage } from "@/types/card";

export interface EvolutionDefinition {
  stage: EvolutionStage;
  label: string;
  kidExplanation: string;
}

export const EVOLUTION_STAGES: EvolutionDefinition[] = [
  {
    stage: "basic",
    label: "Basic",
    kidExplanation:
      "A young company just starting out — like a Basic Pokémon finding its way!",
  },
  {
    stage: "stage-1",
    label: "Stage 1",
    kidExplanation:
      "Growing fast! Revenue is climbing — evolved once and getting stronger.",
  },
  {
    stage: "stage-2",
    label: "Stage 2",
    kidExplanation:
      "A mature, steady company — fully evolved and reliable!",
  },
  {
    stage: "ex",
    label: "EX",
    kidExplanation:
      "An exceptional company with special powers — rare and powerful!",
  },
  {
    stage: "gx",
    label: "GX",
    kidExplanation:
      "A game-changing giant — when a company transforms an entire industry!",
  },
  {
    stage: "vmax",
    label: "VMAX",
    kidExplanation:
      "Maximum power! One of the biggest, most dominant companies in the world.",
  },
];

export function getEvolutionStage(
  marketCap: number,
  revenueGrowth: number | null,
  yearsPublic: number | null
): EvolutionDefinition {
  if (marketCap >= 1_000_000_000_000) return EVOLUTION_STAGES[5];
  if (marketCap >= 500_000_000_000) return EVOLUTION_STAGES[4];
  if (marketCap >= 100_000_000_000) return EVOLUTION_STAGES[3];
  if (revenueGrowth !== null && revenueGrowth > 25) return EVOLUTION_STAGES[1];
  if (yearsPublic !== null && yearsPublic > 20 && marketCap > 10_000_000_000)
    return EVOLUTION_STAGES[2];
  return EVOLUTION_STAGES[0];
}