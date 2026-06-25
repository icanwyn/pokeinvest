import type { PokemonType } from "@/types/card";

interface SectorMascotArtProps {
  type: PokemonType;
  ticker: string;
  color: string;
}

const MASCOTS: Record<PokemonType, { shape: string; accent: string }> = {
  fire: { shape: "flame", accent: "#E25822" },
  water: { shape: "droplet", accent: "#6890F0" },
  grass: { shape: "leaf", accent: "#78C850" },
  electric: { shape: "bolt", accent: "#F8D030" },
  psychic: { shape: "orb", accent: "#F85888" },
  fighting: { shape: "fist", accent: "#C03028" },
  steel: { shape: "gear", accent: "#B8B8D0" },
  fairy: { shape: "star", accent: "#EE99AC" },
  dark: { shape: "moon", accent: "#705848" },
  normal: { shape: "circle", accent: "#A8A878" },
  dragon: { shape: "dragon", accent: "#7038F8" },
};

export function SectorMascotArt({ type, ticker, color }: SectorMascotArtProps) {
  const m = MASCOTS[type] ?? MASCOTS.normal;

  return (
    <svg viewBox="0 0 200 280" className="sector-mascot-svg" aria-hidden>
      <defs>
        <radialGradient id={`bg-${ticker}`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1a1a2e" stopOpacity="0.9" />
        </radialGradient>
      </defs>
      <rect width="200" height="280" fill={`url(#bg-${ticker})`} />
      <text
        x="100"
        y="200"
        textAnchor="middle"
        fontSize="56"
        fontWeight="900"
        fill="rgba(255,255,255,0.15)"
        letterSpacing="6"
      >
        {ticker}
      </text>
      <g transform="translate(100,120)">
        {m.shape === "flame" && (
          <path d="M0,-50 C20,-20 35,0 25,35 C10,55 -10,55 -25,35 C-35,0 -20,-20 0,-50Z" fill={m.accent} />
        )}
        {m.shape === "droplet" && (
          <path d="M0,-45 C25,0 30,30 0,50 C-30,30 -25,0 0,-45Z" fill={m.accent} />
        )}
        {m.shape === "leaf" && (
          <path d="M0,-50 C40,-10 40,40 0,50 C-40,40 -40,-10 0,-50Z" fill={m.accent} />
        )}
        {m.shape === "bolt" && (
          <path d="M8,-50 L-15,5 L5,5 L-8,50 L20,-5 L0,-5 Z" fill={m.accent} />
        )}
        {m.shape === "orb" && (
          <circle r="42" fill={m.accent} opacity="0.9" />
        )}
        {m.shape === "fist" && (
          <rect x="-30" y="-35" width="60" height="70" rx="15" fill={m.accent} />
        )}
        {m.shape === "gear" && (
          <circle r="38" fill="none" stroke={m.accent} strokeWidth="12" />
        )}
        {m.shape === "star" && (
          <polygon points="0,-45 12,-12 45,-12 18,8 28,42 0,22 -28,42 -18,8 -45,-12 -12,-12" fill={m.accent} />
        )}
        {m.shape === "moon" && (
          <path d="M25,-40 A45,45 0 1 0 25,40 A35,35 0 1 1 25,-40Z" fill={m.accent} />
        )}
        {m.shape === "circle" && (
          <circle r="40" fill={m.accent} />
        )}
        {m.shape === "dragon" && (
          <path d="M-40,30 Q-50,-30 0,-45 Q50,-30 40,30 Q20,50 0,45 Q-20,50 -40,30Z" fill={m.accent} />
        )}
      </g>
    </svg>
  );
}