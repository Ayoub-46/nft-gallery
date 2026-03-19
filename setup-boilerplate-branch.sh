#!/usr/bin/env bash
# =============================================================================
# setup-boilerplate-branch.sh
#
# Run this from the root of your nft-viewer repo AFTER your main branch
# is fully committed and working.
#
# What it does:
#   1. Creates a new "boilerplate" branch from main
#   2. Replaces the four files students will work on with stub versions
#   3. Adds the empty student test file
#   4. Commits everything ready for students to clone
#
# Usage:
#   chmod +x setup-boilerplate-branch.sh
#   ./setup-boilerplate-branch.sh
# =============================================================================

set -e  # Exit immediately on any error

echo "🔀 Creating boilerplate branch from main..."
git checkout main
git checkout -b boilerplate

# =============================================================================
# 1. Smart contract — remove publicMint & withdraw, add TODO comments
# =============================================================================
echo "📝 Replacing MockNFT.sol with stub version..."
cat > packages/contracts/src/MockNFT.sol << 'SOLIDITY'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockNFT
 * @notice A simple ERC721 contract for local development and testing.
 * @dev Extends ERC721Enumerable so we can easily query tokens by owner index,
 *      which our frontend uses to build the NFT grid.
 */
contract MockNFT is ERC721, ERC721Enumerable, Ownable {
    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    uint256 private _nextTokenId;
    string private _baseTokenURI;

    // TODO (Part C): Add a public state variable called `mintPrice`
    // It should be of type uint256 and set to 0.01 ether in the constructor.

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event BatchMinted(address indexed to, uint256 startId, uint256 endId);

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI;
        _nextTokenId = 1;

        // TODO (Part C): initialise mintPrice here
    }

    // -------------------------------------------------------------------------
    // Owner-only minting (do not modify these)
    // -------------------------------------------------------------------------

    function mint(address to) external onlyOwner returns (uint256 tokenId) {
        tokenId = _nextTokenId;
        _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function batchMint(address to, uint256 quantity) external onlyOwner {
        require(quantity > 0 && quantity <= 50, "MockNFT: quantity out of range");
        uint256 startId = _nextTokenId;
        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(to, _nextTokenId);
            _nextTokenId++;
        }
        emit BatchMinted(to, startId, _nextTokenId - 1);
    }

    // -------------------------------------------------------------------------
    // TODO (Part C): Add publicMint() — payable, public, no onlyOwner
    //   - Revert if msg.value != mintPrice
    //   - Mint one token to msg.sender
    //   - Return the token ID
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // TODO (Part C): Add withdraw() — onlyOwner
    //   - Send the contract's entire ETH balance to the owner
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // Metadata
    // -------------------------------------------------------------------------

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // -------------------------------------------------------------------------
    // View helpers
    // -------------------------------------------------------------------------

    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokens;
    }

    function totalMinted() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    // -------------------------------------------------------------------------
    // Required overrides
    // -------------------------------------------------------------------------

    function _update(address to, uint256 tokenId, address auth)
        internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
SOLIDITY

# =============================================================================
# 2. Student test file — empty stubs for Parts B and C
# =============================================================================
echo "🧪 Adding MockNFTStudent.t.sol stub..."
cat > packages/contracts/test/MockNFTStudent.t.sol << 'SOLIDITY'
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MockNFT.sol";

/**
 * @notice Your personal test suite. Add all your Part B and Part C tests here.
 *
 * Run with:
 *   forge test --match-contract MockNFTStudentTest -vv
 */
contract MockNFTStudentTest is Test {
    MockNFT public nft;
    address public alice = makeAddr("alice");
    address public bob   = makeAddr("bob");

    function setUp() public {
        nft = new MockNFT("MockNFT", "MNFT", "ipfs://test-cid/");
    }

    // =========================================================================
    // PART B — Write three tests
    // =========================================================================

    // TODO: Test 1 — mint to alice, alice transfers to bob, assert bob owns it
    function test_Transfer() public {
        // implement here
    }

    // TODO: Test 2 — batchMint(alice, 0) should revert
    function test_BatchMintRevertsOnZeroQuantity() public {
        // implement here
    }

    // TODO: Test 3 — mint 3 to alice then 2 to bob, assert token IDs 1-5 in order
    function test_TokenIdsAreSequential() public {
        // implement here
    }

    // =========================================================================
    // PART C — Test your publicMint() and withdraw() functions
    // =========================================================================

    // TODO: Test C1 — alice sends 0.01 ether, assert she owns token 1
    function test_PublicMint_Success() public {
        // implement here
    }

    // TODO: Test C2 — alice sends 0.005 ether, assert revert
    function test_PublicMint_RevertsOnWrongPrice() public {
        // implement here
    }

    // TODO: Test C3 — after alice mints, withdraw() sends 0.01 ether to owner
    function test_Withdraw() public {
        // implement here
    }
}
SOLIDITY

# =============================================================================
# 3. contracts.ts — ABI entries for mintPrice and publicMint removed
# =============================================================================
echo "⚙️  Replacing contracts.ts with stub version..."
cat > packages/frontend/src/lib/contracts.ts << 'TYPESCRIPT'
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
TYPESCRIPT

# =============================================================================
# 4. useMintPrice.ts — empty stub for Part D2
# =============================================================================
echo "🪝 Adding useMintPrice.ts stub..."
cat > packages/frontend/src/hooks/useMintPrice.ts << 'TYPESCRIPT'
"use client";

/**
 * Part D2 — useMintPrice hook
 *
 * Implement this hook so it reads `mintPrice` from the deployed contract.
 *
 * Steps:
 *   1. Use useQuery to load the deployment config (see useNfts.ts for the pattern)
 *   2. Use useReadContract to call "mintPrice" on the contract
 *   3. Format the result with formatEther from viem
 *   4. Return the result object
 *
 * Uncomment the imports below as you need them:
 */

// import { useReadContract } from "wagmi";
// import { useQuery } from "@tanstack/react-query";
// import { formatEther } from "viem";
// import { MOCK_NFT_ABI, loadDeploymentConfig } from "@/lib/contracts";

export interface UseMintPriceResult {
  mintPrice: bigint | undefined;
  mintPriceEth: string;
  isLoading: boolean;
  isError: boolean;
}

export function useMintPrice(): UseMintPriceResult {
  // TODO: implement this hook

  // Remove this placeholder return once you have real values:
  return {
    mintPrice: undefined,
    mintPriceEth: "...",
    isLoading: true,
    isError: false,
  };
}
TYPESCRIPT

# =============================================================================
# 5. page.tsx — mint panel section removed, TODO comments added
# =============================================================================
echo "🖥️  Replacing page.tsx with stub version..."
cat > packages/frontend/src/app/page.tsx << 'TYPESCRIPT'
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
TYPESCRIPT

# =============================================================================
# 6. Commit the boilerplate branch
# =============================================================================
echo "📦 Committing boilerplate branch..."
git add \
  packages/contracts/src/MockNFT.sol \
  packages/contracts/test/MockNFTStudent.t.sol \
  packages/frontend/src/lib/contracts.ts \
  packages/frontend/src/hooks/useMintPrice.ts \
  packages/frontend/src/app/page.tsx

git commit -m "chore: boilerplate branch — student exercise stubs

Removes completed implementations and replaces with TODO stubs:
  - MockNFT.sol        → publicMint() and withdraw() removed (Part C)
  - MockNFTStudent.t.sol → empty test stubs added (Parts B & C)
  - contracts.ts       → mintPrice and publicMint ABI entries removed (Part D1)
  - useMintPrice.ts    → empty hook stub added (Part D2)
  - page.tsx           → mint panel removed (Part D3)

Students clone this branch and work through the lab instructions."

echo ""
echo "✅ Done! Your branches are:"
echo "   main        → complete solution (your reference)"
echo "   boilerplate → student starting point"
echo ""
echo "Push both to GitHub:"
echo "   git push origin main"
echo "   git push origin boilerplate"
echo ""
echo "Tell students to clone the boilerplate branch:"
echo "   git clone --branch boilerplate https://github.com/YOUR_USERNAME/nft-viewer.git"