import { getSP500CardArtPath, hasSP500CardArt } from "@/lib/sp500-art-manifest";

/**
 * Pre-generated company card art (from Imagine image_gen).
 * Each mascot captures the company's essence — kid-friendly, no copyrighted characters.
 * Art is generated in 4:3 landscape to match the card art box (.art-placeholder).
 *
 * S&P 500 companies use logo-composite art in /cards/sp500/ (see scripts/generate-sp500-card-art.mjs).
 */
export const CARD_ART_ASPECT = "4:3";

/**
 * Session file numbers for landscape art (21–40).
 * Verified by visual inspection — async generation order ≠ call order.
 */
export const LANDSCAPE_SOURCE_MANIFEST: Record<string, number> = {
  AAPL: 21,
  KO: 22,
  NVDA: 23,
  DIS: 24,
  NKE: 25,
  MSFT: 26,
  MCD: 27,
  TSLA: 28,
  WMT: 29,
  AMZN: 30,
  SBUX: 31,
  NFLX: 32,
  PG: 33,
  V: 34,
  PEP: 35,
  JPM: 36,
  COST: 37,
  MAT: 38,
  HAS: 39,
  XOM: 40,
};

export function landscapeCardArtPrompt(essence: string): string {
  return (
    `Wide horizontal landscape trading card center art, 4:3 aspect ratio. ` +
    `${essence}. Kid-friendly anime-influenced original mascot, vibrant colors, ` +
    `subject fills the frame width with minimal empty margins. ` +
    `Soft cream gradient background, no logos, no text, no copyrighted characters.`
  );
}

export interface CardArtEntry {
  ticker: string;
  path: string;
  essence: string;
  prompt: string;
}

export const CARD_ART_CATALOG: CardArtEntry[] = [
  {
    ticker: "AAPL",
    path: "/cards/AAPL.jpg",
    essence: "Tech sprite — innovation, simplicity, friendly gadgets",
    prompt: "Silver tech creature with apple crest and glowing phone",
  },
  {
    ticker: "DIS",
    path: "/cards/DIS.jpg",
    essence: "Storyteller sprite — wonder, imagination, fairy-tale adventure",
    prompt: "Dream sprite with crown, story pages, castle silhouette",
  },
  {
    ticker: "KO",
    path: "/cards/KO.jpg",
    essence: "Refreshment spirit — happiness, fizzy joy, shared moments",
    prompt: "Cherry-red bubble creature with fizzy soda bubbles",
  },
  {
    ticker: "NVDA",
    path: "/cards/NVDA.jpg",
    essence: "Circuit dragon — AI power, gaming graphics, future tech",
    prompt: "Tech dragon with green circuit markings and GPU chip",
  },
  {
    ticker: "NKE",
    path: "/cards/NKE.jpg",
    essence: "Speed spirit — athletic energy, motion, determination",
    prompt: "Orange-black speed spirit mid-sprint with motion trail",
  },
  {
    ticker: "MCD",
    path: "/cards/MCD.jpg",
    essence: "Golden food fairy — fast-food fun, warmth, everyday joy",
    prompt: "Golden food fairy beneath glowing arch gateway",
  },
  {
    ticker: "TSLA",
    path: "/cards/TSLA.jpg",
    essence: "Electric fox — clean energy, innovation, the road ahead",
    prompt: "Silver-red electric fox beside futuristic EV silhouette",
  },
  {
    ticker: "MSFT",
    path: "/cards/MSFT.jpg",
    essence: "Cloud window spirit — software, productivity, play for everyone",
    prompt: "Four-square cloud creature with laptop and controller",
  },
  { ticker: "WMT", path: "/cards/WMT.jpg", essence: "Retail guardian — big stores, everyday shopping", prompt: "Blue retail creature with shopping cart" },
  { ticker: "AMZN", path: "/cards/AMZN.jpg", essence: "Delivery box spirit — packages to your door", prompt: "Brown box creature with packages" },
  { ticker: "SBUX", path: "/cards/SBUX.jpg", essence: "Coffee spirit — warm cafes and steam", prompt: "Green coffee spirit with cup" },
  { ticker: "NFLX", path: "/cards/NFLX.jpg", essence: "Stream sprite — movies and shows at home", prompt: "Purple entertainment sprite with film reel" },
  { ticker: "PEP", path: "/cards/PEP.jpg", essence: "Blue soda spirit — refreshing rival cola", prompt: "Blue bubbly soda creature" },
  { ticker: "JPM", path: "/cards/JPM.jpg", essence: "Bank guardian — trust and finance", prompt: "Blue bank guardian with coin shield" },
  { ticker: "V", path: "/cards/V.jpg", essence: "Payment sprite — swipe and go commerce", prompt: "Gold payment sprite with card glow" },
  { ticker: "PG", path: "/cards/PG.jpg", essence: "Household fairy — soap, care, everyday essentials", prompt: "Green household care fairy" },
  { ticker: "XOM", path: "/cards/XOM.jpg", essence: "Oil flame spirit — gas stations and energy", prompt: "Red-orange oil flame spirit" },
  { ticker: "COST", path: "/cards/COST.jpg", essence: "Warehouse jolly — bulk shopping fun", prompt: "Red warehouse creature with cart" },
  { ticker: "MAT", path: "/cards/MAT.jpg", essence: "Toy fairy — dolls, cars, imagination", prompt: "Pink toy fairy with doll and race car" },
  { ticker: "HAS", path: "/cards/HAS.jpg", essence: "Toy robot — action figures and play", prompt: "Bold toy robot with action figure" },
];

const ART_MAP = new Map(CARD_ART_CATALOG.map((a) => [a.ticker, a]));

/** Bump when card image files are replaced so browsers fetch fresh art. */
export const CARD_ART_VERSION = 7;

export function getCardArtUrl(ticker: string): string | undefined {
  const sym = ticker.toUpperCase();
  const catalog = ART_MAP.get(sym)?.path;
  if (catalog) return `${catalog}?v=${CARD_ART_VERSION}`;
  if (hasSP500CardArt(sym)) {
    return `${getSP500CardArtPath(sym)}?v=${CARD_ART_VERSION}`;
  }
  return undefined;
}

export function hasCardArt(ticker: string): boolean {
  const sym = ticker.toUpperCase();
  return ART_MAP.has(sym) || hasSP500CardArt(sym);
}

export function getCardArtPrompt(ticker: string, companyName: string, sector: string): string {
  const entry = ART_MAP.get(ticker.toUpperCase());
  const essence =
    entry?.essence ??
    `Original mascot themed to ${companyName} in the ${sector} industry`;
  return landscapeCardArtPrompt(essence);
}