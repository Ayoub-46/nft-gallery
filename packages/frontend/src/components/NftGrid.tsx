"use client";

import { useAccount } from "wagmi";
import { useNfts } from "@/hooks/useNfts";
import { NftCard } from "./NftCard";

export function NftGrid() {
  const { address, isConnected } = useAccount();
  const { nfts, isLoading, isError, error, refetch } = useNfts(address);

  // ── Not connected ─────────────────────────────────────────────────────────
  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-800 py-20 text-center">
        <div className="text-4xl">🔗</div>
        <p className="text-gray-400 font-medium">Connect your wallet to view your NFTs</p>
        <p className="text-gray-600 text-sm">Your collection will appear here</p>
      </div>
    );
  }

  // ── Loading token IDs / URIs ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div>
        <div className="mb-6 h-7 w-40 animate-pulse rounded-lg bg-gray-800" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-gray-900">
              <div className="aspect-square w-full animate-pulse bg-gray-800" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-700" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── Contract read error ───────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-red-900/40 bg-red-950/20 py-20 text-center">
        <div className="text-4xl">⚠️</div>
        <div>
          <p className="font-semibold text-red-400">Failed to load NFTs</p>
          <p className="mt-1 text-sm text-red-600 font-mono">
            {error?.message ?? "Unknown error"}
          </p>
        </div>
        <button
          onClick={refetch}
          className="rounded-lg bg-red-900/40 px-4 py-2 text-sm text-red-300 hover:bg-red-900/60 transition-colors border border-red-800/40"
        >
          Try again
        </button>
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-800 py-20 text-center">
        <div className="text-4xl">🖼️</div>
        <p className="text-gray-400 font-medium">No NFTs found</p>
        <p className="text-gray-600 text-sm">
          This wallet doesn&apos;t own any tokens from this collection
        </p>
      </div>
    );
  }

  // ── NFT grid ──────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Your Collection
          <span className="ml-2 rounded-full bg-indigo-950 border border-indigo-500/30 px-2.5 py-0.5 text-sm font-mono text-indigo-400">
            {nfts.length}
          </span>
        </h2>
        <button
          onClick={refetch}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-all"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {nfts.map((nft) => (
          <NftCard key={nft.tokenId.toString()} nft={nft} />
        ))}
      </div>
    </div>
  );
}