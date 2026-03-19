import { type Abi } from "viem";

/**
 * Minimal ABI for MockNFT.
 *
 * Part D1: Add two missing entries at the bottom:
 *   - mintPrice()  → view, no inputs, returns uint256
 *   - publicMint() → payable, no inputs, returns uint256
 */
export const MOCK_NFT_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "tokenOfOwnerByIndex",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "tokenURI",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
  },
  {
    name: "tokensOfOwner",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },

  // TODO (Part D1): Add mintPrice() ABI entry here

  // TODO (Part D1): Add publicMint() ABI entry here

] as const satisfies Abi;

export interface DeploymentConfig {
  MockNFT: `0x${string}`;
  baseTokenURI: string;
}

export async function loadDeploymentConfig(): Promise<DeploymentConfig> {
  const res = await fetch("/deployment.json");
  if (!res.ok) throw new Error("deployment.json not found. Run npm run deploy:local first.");
  const config = (await res.json()) as DeploymentConfig;
  if (!config.MockNFT || config.MockNFT === "0x") throw new Error("deployment.json missing MockNFT address.");
  if (!config.baseTokenURI || config.baseTokenURI.includes("YOUR_METADATA_CID_HERE"))
    throw new Error("baseTokenURI still contains the placeholder. Paste your real IPFS CID and redeploy.");
  return config;
}
