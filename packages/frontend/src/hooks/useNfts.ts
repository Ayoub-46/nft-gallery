"use client";

import { useReadContract, useReadContracts } from "wagmi";
import { useQuery, useQueries } from "@tanstack/react-query";
import { MOCK_NFT_ABI, loadDeploymentConfig } from "@/lib/contracts";
import { fetchNftMetadata, resolveIpfsUrl, type NftMetadata } from "@/lib/ipfs";

export interface NftItem {
  tokenId: bigint;
  tokenUri: string;
  metadata: NftMetadata | null;
  imageUrl: string;
  name: string;
  isMetadataLoading: boolean;
  isMetadataError: boolean;
}

export interface UseNftsResult {
  nfts: NftItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useNfts(ownerAddress?: `0x${string}`): UseNftsResult {
  // ── 0. Load deployment config (address + baseTokenURI) ───────────────────
  const {
    data: config,
    isLoading: isLoadingConfig,
    isError: isErrorConfig,
    error: errorConfig,
  } = useQuery({
    queryKey: ["deployment-config"],
    queryFn: loadDeploymentConfig,
    staleTime: Infinity, // Config never changes during a session
  });

  // ── 1. Fetch token IDs ────────────────────────────────────────────────────
  const {
    data: tokenIds,
    isLoading: isLoadingIds,
    isError: isErrorIds,
    error: errorIds,
    refetch,
  } = useReadContract({
    address: config?.MockNFT,
    abi: MOCK_NFT_ABI,
    functionName: "tokensOfOwner",
    args: ownerAddress ? [ownerAddress] : undefined,
    query: {
      enabled: !!ownerAddress && !!config?.MockNFT,
      staleTime: 30_000,
    },
  });

  // ── 2. Batch-fetch tokenURIs ──────────────────────────────────────────────
  const {
    data: tokenUriResults,
    isLoading: isLoadingUris,
    isError: isErrorUris,
    error: errorUris,
  } = useReadContracts({
    contracts: (tokenIds ?? []).map((tokenId) => ({
      address: config?.MockNFT,
      abi: MOCK_NFT_ABI,
      functionName: "tokenURI" as const,
      args: [tokenId] as const,
    })),
    query: {
      enabled: !!config && !!tokenIds && tokenIds.length > 0,
      staleTime: 30_000,
    },
  });

  // ── 3. Fetch metadata for each token ─────────────────────────────────────
  const metadataQueries = useQueries({
    queries: (tokenIds ?? []).map((tokenId, index) => {
      const uriResult = tokenUriResults?.[index];
      const tokenUri =
        uriResult?.status === "success" ? (uriResult.result as string) : null;

      return {
        queryKey: ["nft-metadata", config?.MockNFT, tokenId.toString()],
        queryFn: () => fetchNftMetadata(tokenUri!),
        enabled: !!tokenUri,
        staleTime: Infinity,
        retry: 2,
      };
    }),
  });

  // ── 4. Zip into NftItem array ─────────────────────────────────────────────
  const nfts: NftItem[] = (tokenIds ?? []).map((tokenId, index) => {
    const uriResult = tokenUriResults?.[index];
    const tokenUri =
      uriResult?.status === "success" ? (uriResult.result as string) : "";

    const metaQuery = metadataQueries[index];
    const metadata = metaQuery?.data ?? null;
    const imageUrl = metadata?.image ? resolveIpfsUrl(metadata.image) : "";

    return {
      tokenId,
      tokenUri,
      metadata,
      imageUrl,
      name: metadata?.name ?? `NFT #${tokenId.toString()}`,
      isMetadataLoading: metaQuery?.isLoading ?? false,
      isMetadataError: metaQuery?.isError ?? false,
    };
  });

  return {
    nfts,
    isLoading: isLoadingConfig || isLoadingIds || isLoadingUris,
    isError: isErrorConfig || isErrorIds || isErrorUris,
    error: (errorConfig ?? errorIds ?? errorUris ?? null) as Error | null,
    refetch,
  };
}