"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { NftGrid } from "@/components/NftGrid";

// TODO (Part D3): import useMintPrice from "@/hooks/useMintPrice"
// TODO (Part D3): import useWriteContract from "wagmi"

export default function HomePage() {
  // TODO (Part D3): call useMintPrice() here
  // const { mintPrice, mintPriceEth, isLoading } = useMintPrice();

  // TODO (Part D3): call useWriteContract here
  // const { writeContract } = useWriteContract();

  return (
    <main className="min-h-screen bg-gray-950 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <header className="mb-10 flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              NFT Viewer
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Viewing collection at{" "}
              <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-indigo-400 text-xs">
                0x5FbDB231…
              </code>
            </p>
          </div>
          <ConnectButton />
        </header>

        {/*
         * TODO (Part D3): Add the mint panel here.
         *
         * It should show:
         *   1. "Mint price: {mintPriceEth} ETH"
         *      Show an animated skeleton (grey div) while isLoading is true.
         *
         *   2. A "Mint an NFT" button that calls writeContract() with:
         *        functionName: "publicMint"
         *        value:        mintPrice   (the bigint from useMintPrice)
         *
         * Tailwind hints:
         *   skeleton: className="h-5 w-32 animate-pulse rounded bg-gray-700"
         *   button:   className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
         */}

        {/* NFT Grid */}
        <NftGrid />

      </div>
    </main>
  );
}
