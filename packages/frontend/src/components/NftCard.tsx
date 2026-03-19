"use client";

import { useState } from "react";
import type { NftItem } from "@/hooks/useNfts";

interface NftCardProps {
  nft: NftItem;
}

export function NftCard({ nft }: NftCardProps) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const showSkeleton = nft.isMetadataLoading || (!imgLoaded && !imgError && !!nft.imageUrl);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gray-900 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-indigo-500/20 hover:shadow-2xl hover:border-indigo-500/40">

      {/* ── Image area ───────────────────────────────────────────────────── */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-800">

        {/* Skeleton shimmer while loading */}
        {showSkeleton && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800" />
        )}

        {/* Actual NFT image */}
        {nft.imageUrl && !imgError ? (
          <img
            src={nft.imageUrl}
            alt={nft.name}
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
          />
        ) : null}

        {/* Fallback when no image or broken URL */}
        {(imgError || (!nft.imageUrl && !nft.isMetadataLoading)) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-600">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">No image</span>
          </div>
        )}

        {/* Token ID badge */}
        <div className="absolute top-2 right-2 rounded-full bg-black/60 px-2.5 py-0.5 text-xs font-mono text-gray-300 backdrop-blur-sm">
          #{nft.tokenId.toString()}
        </div>
      </div>

      {/* ── Metadata area ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1 p-4">
        {nft.isMetadataLoading ? (
          <>
            <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-700" />
            <div className="h-3 w-1/2 animate-pulse rounded-md bg-gray-800" />
          </>
        ) : (
          <>
            <h3 className="truncate font-semibold text-white text-sm leading-tight">
              {nft.name}
            </h3>
            {nft.metadata?.description && (
              <p className="line-clamp-2 text-xs text-gray-500 leading-relaxed">
                {nft.metadata.description}
              </p>
            )}
          </>
        )}

        {/* Attributes (if present) */}
        {nft.metadata?.attributes && nft.metadata.attributes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {nft.metadata.attributes.slice(0, 3).map((attr, i) => (
              <span
                key={i}
                className="rounded-md bg-indigo-950/60 border border-indigo-500/20 px-2 py-0.5 text-xs text-indigo-300"
              >
                {attr.trait_type}: {attr.value}
              </span>
            ))}
            {nft.metadata.attributes.length > 3 && (
              <span className="rounded-md bg-gray-800 px-2 py-0.5 text-xs text-gray-500">
                +{nft.metadata.attributes.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}