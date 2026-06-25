export type PokemonType =
  | "fire"
  | "water"
  | "grass"
  | "electric"
  | "psychic"
  | "fighting"
  | "steel"
  | "fairy"
  | "dark"
  | "normal"
  | "dragon";

export type RarityTier =
  | "common"
  | "uncommon"
  | "rare"
  | "holo-rare"
  | "ultra-rare"
  | "secret-rare";

export type EvolutionStage =
  | "basic"
  | "stage-1"
  | "stage-2"
  | "ex"
  | "gx"
  | "vmax";

export interface CardStat {
  label: string;
  value: string | number;
  max?: number;
  pokemonMetaphor: string;
  kidExplanation: string;
}

export interface SpecialAbility {
  name: string;
  description: string;
  value: string;
}

export interface BalanceSheetSummary {
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  cash: number;
  totalDebt: number;
  currentRatio: number;
}

export interface StockCard {
  ticker: string;
  companyName: string;
  sector: string;
  industry: string;
  pokemonType: PokemonType;
  typeColor: string;
  rarity: RarityTier;
  evolutionStage: EvolutionStage;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  marketCap: number;
  /** Pokémon-style header HP — higher = sturdier company (not P/E). */
  healthHp?: number;
  healthHpNote?: string;
  stats: CardStat[];
  specialAbility?: SpecialAbility;
  balanceSheet: BalanceSheetSummary;
  avatarUrl?: string;
  avatarKind?: "catalog" | "logo" | "sector";
  website?: string;
  description: string;
  fetchedAt: string;
}

export interface PortfolioHolding extends StockCard {
  quantity: number;
}

export interface LessonSection {
  heading: string;
  body: string;
  emoji?: string;
}

export interface TryItActivity {
  title: string;
  steps: string[];
  reflectionQuestion?: string;
}

export type LessonDifficulty = "beginner" | "intermediate" | "advanced";

export interface LessonConcept {
  id: string;
  title: string;
  summary: string;
  pokemonAnalogy: string;
  investingConcept: string;
  kidExplanation: string;
  sections: LessonSection[];
  keyTakeaways: string[];
  tryItActivity: TryItActivity;
  coachNote: string;
  pokemonExample: string;
  difficulty: LessonDifficulty;
  estimatedMinutes: number;
}

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  pokemonTieIn: string;
}

export interface AdventureStep {
  lessonId: string;
  order: number;
  prerequisites: string[];
  badgeName: string;
  badgeEmoji: string;
}