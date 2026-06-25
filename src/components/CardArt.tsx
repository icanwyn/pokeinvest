"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { SectorMascotArt } from "@/components/SectorMascotArt";
import { resolveAvatarClient, type AvatarKind } from "@/lib/resolve-avatar";
import type { StockCard } from "@/types/card";

interface CardArtProps {
  card: StockCard;
}

export function CardArt({ card }: CardArtProps) {
  // Always derive art from ticker — never trust cached avatarUrl from localStorage.
  const resolved = useMemo(
    () => resolveAvatarClient(card.ticker, card.pokemonType),
    [card.ticker, card.pokemonType]
  );

  const [kind, setKind] = useState<AvatarKind>(resolved.kind);
  const [url, setUrl] = useState(resolved.url);

  useEffect(() => {
    setKind(resolved.kind);
    setUrl(resolved.url);
  }, [card.ticker, resolved.kind, resolved.url]);

  const handleLogoError = () => {
    setKind("sector");
    setUrl("");
  };

  if (kind === "sector") {
    return (
      <SectorMascotArt
        type={card.pokemonType}
        ticker={card.ticker}
        color={card.typeColor}
      />
    );
  }

  if (kind === "logo") {
    return (
      <div
        className="card-art-logo-wrap"
        style={{
          background: `linear-gradient(160deg, ${card.typeColor}33, ${card.typeColor}66)`,
        }}
      >
        <Image
          key={`${card.ticker}-logo`}
          src={url}
          alt={`${card.companyName} logo`}
          width={120}
          height={120}
          className="card-art-logo"
          onError={handleLogoError}
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className="card-art-catalog-wrap">
      <Image
        key={`${card.ticker}-${url}`}
        src={url}
        alt={`${card.ticker} card art`}
        fill
        className="card-art-image"
        sizes="192px"
        onError={handleLogoError}
        unoptimized
      />
    </div>
  );
}