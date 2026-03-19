/**
 * Public IPFS gateways, tried in order.
 * Cloudflare is fast and reliable; the others are fallbacks.
 */
const GATEWAYS = [
  "http://127.0.0.1:8080/ipfs/",  // Local Kubo node — fastest for dev
  "https://cloudflare-ipfs.com/ipfs/",
  "https://ipfs.io/ipfs/",
] as const;

/**
 * Converts any ipfs:// URI to an HTTP gateway URL.
 * Passes through http/https URLs unchanged.
 *
 * @example
 *   resolveIpfsUrl("ipfs://Qm.../1.json")
 *   // → "https://cloudflare-ipfs.com/ipfs/Qm.../1.json"
 */
export function resolveIpfsUrl(
  uri: string,
  gatewayIndex: number = 0
): string {
  if (!uri) return "";

  // Already a plain HTTP URL — nothing to do
  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    return uri;
  }

  // ipfs://<CID>/optional/path
  if (uri.startsWith("ipfs://")) {
    const cid = uri.slice(7); // strip "ipfs://"
    const gateway = GATEWAYS[gatewayIndex % GATEWAYS.length];
    return `${gateway}${cid}`;
  }

  // ipfs/<CID> (no double-slash variant)
  if (uri.startsWith("ipfs/")) {
    const cid = uri.slice(5);
    const gateway = GATEWAYS[gatewayIndex % GATEWAYS.length];
    return `${gateway}${cid}`;
  }

  // Base58 CID directly (starts with "Qm" or "baf")
  if (uri.startsWith("Qm") || uri.startsWith("baf")) {
    const gateway = GATEWAYS[gatewayIndex % GATEWAYS.length];
    return `${gateway}${uri}`;
  }

  // Unknown scheme — return as-is and let the browser handle it
  return uri;
}

// ---------------------------------------------------------------------------
// NFT Metadata types
// ---------------------------------------------------------------------------

export interface NftAttribute {
  trait_type: string;
  value: string | number;
}

/**
 * Loosely typed to handle both OpenSea-standard and custom metadata schemas.
 */
export interface NftMetadata {
  name: string;
  description?: string;
  image: string;
  attributes?: NftAttribute[];
  // Some contracts use "image_url" instead of "image"
  image_url?: string;
}

/**
 * Fetches and parses NFT JSON metadata from a tokenURI.
 * Handles both on-chain base64-encoded data URIs and remote IPFS/HTTP URIs.
 *
 * @throws if the fetch fails or the response isn't valid JSON
 */
export async function fetchNftMetadata(tokenUri: string): Promise<NftMetadata> {
  // ── On-chain base64 data URI ──────────────────────────────────────────────
  // Format: data:application/json;base64,<base64-encoded-json>
  if (tokenUri.startsWith("data:application/json;base64,")) {
    const base64 = tokenUri.split(",")[1];
    const json = atob(base64);
    return JSON.parse(json) as NftMetadata;
  }

  // ── On-chain plain JSON data URI ──────────────────────────────────────────
  // Format: data:application/json,<url-encoded-json>
  if (tokenUri.startsWith("data:application/json,")) {
    const json = decodeURIComponent(tokenUri.split(",")[1]);
    return JSON.parse(json) as NftMetadata;
  }

  // ── Remote URI (IPFS or HTTP) ─────────────────────────────────────────────
  const httpUrl = resolveIpfsUrl(tokenUri);
  const res = await fetch(httpUrl);

  if (!res.ok) {
    throw new Error(
      `Failed to fetch metadata from ${httpUrl}: ${res.status} ${res.statusText}`
    );
  }

  const metadata = (await res.json()) as NftMetadata;

  // Normalise: some contracts put the image under "image_url"
  if (!metadata.image && metadata.image_url) {
    metadata.image = metadata.image_url;
  }

  return metadata;
}