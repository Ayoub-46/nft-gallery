# NFT Viewer

A full-stack Web3 learning project for displaying ERC721 NFTs owned by a connected wallet. Built with a local Foundry blockchain, a local IPFS node, and a Next.js frontend.

```
nft-viewer/
├── packages/
│   ├── contracts/        — Foundry (Solidity) smart contracts
│   └── frontend/         — Next.js application
└── package.json          — npm workspaces root
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Smart Contracts | [Foundry](https://book.getfoundry.sh/) · Solidity 0.8.20 · OpenZeppelin |
| Local Chain | [Anvil](https://book.getfoundry.sh/anvil/) (bundled with Foundry) |
| Local IPFS | [Kubo](https://docs.ipfs.tech/install/command-line/) (official IPFS daemon) |
| Frontend | [Next.js 14](https://nextjs.org/) · App Router · TypeScript · Tailwind CSS |
| Web3 | [Wagmi v2](https://wagmi.sh/) · [Viem](https://viem.sh/) · [TanStack Query](https://tanstack.com/query) |
| Wallet | [RainbowKit](https://www.rainbowkit.com/) |

---

## Prerequisites

Install these tools before you begin:

```bash
# 1. Foundry (includes forge, anvil, cast)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# 2. Kubo — local IPFS node
#    macOS:
brew install ipfs
#    Linux: https://docs.ipfs.tech/install/command-line/

# 3. Node.js 18+ and npm 9+
node --version   # v18 or higher
npm --version    # v9 or higher
```

---

## First-Time Setup

### 1. Clone & install dependencies

```bash
git clone https://github.com/Ayoub-46/nft-gallery.git
cd nft-viewer

# Install all workspace dependencies
npm install

# Install Foundry dependencies (OpenZeppelin)
cd packages/contracts
forge install OpenZeppelin/openzeppelin-contracts --no-commit
cd ../..
```

### 2. Initialise the local IPFS node (one-time only)

```bash
ipfs init

# Allow the frontend dev server to fetch from the local gateway
ipfs config --json Gateway.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3000"]'
ipfs config --json Gateway.HTTPHeaders.Access-Control-Allow-Methods '["GET"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3000"]'
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["GET", "POST"]'
```

### 3. Set your WalletConnect Project ID (optional for local dev)

```bash
cp packages/frontend/.env.local.example packages/frontend/.env.local
# Edit .env.local and add your Project ID from https://cloud.walletconnect.com
# You can leave it blank for MetaMask-only local testing
```

---

## Running the Project

You need **four terminals** running simultaneously:

```bash
# Terminal 1 — Local IPFS node
ipfs daemon

# Terminal 2 — Local Anvil blockchain
cd packages/contracts
npm run anvil

# Terminal 3 — Generate NFT assets, upload to IPFS, deploy contract
node packages/contracts/nft-assets/generate.mjs
# → copy the printed metadata CID into packages/contracts/script/DeployMockNFT.s.sol
# → then:
cd packages/contracts
npm run deploy:local

# Terminal 4 — Next.js frontend
cd packages/frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Connecting MetaMask to Anvil

1. Open MetaMask → click the network dropdown → **Add a custom network**

| Field | Value |
|---|---|
| Network Name | `Anvil Local` |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency Symbol | `ETH` |

2. Import a test wallet using Anvil's default Account #0 private key:
```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
> ⚠️ This key is publicly known. Use it for local development only — never on mainnet.

3. Connect the wallet on the frontend. You should see **5 NFTs** in the grid.

---

## Project Walkthrough

### Smart Contract — `MockNFT.sol`

An ERC721 contract with two key additions:

- **`ERC721Enumerable`** — lets us call `tokenOfOwnerByIndex` to find all tokens an address owns without an off-chain indexer.
- **`tokensOfOwner(address)`** — a convenience view function that returns all token IDs for an owner in one call, which the frontend uses to minimise RPC round-trips.

### NFT Asset Pipeline

```
generate.mjs
  → creates 5 SVG images → converts to PNG via Sharp
  → ipfs add → gets image CID
  → creates 5 JSON metadata files referencing ipfs://<imageCID>/<id>.png
  → ipfs add → gets metadata CID
  → prints baseTokenURI to paste into the deploy script
```

### Frontend Data Flow

```
useNfts() hook
  → fetch /public/deployment.json          (contract address + baseURI)
  → contract.tokensOfOwner(walletAddress)  (all token IDs in one call)
  → contract.tokenURI(id) × N             (batched via useReadContracts)
  → resolveIpfsUrl()                       (ipfs:// → http://127.0.0.1:8080/ipfs/)
  → fetch metadata JSON × N               (parallel via useQueries)
  → resolveIpfsUrl() on metadata.image
  → <NftGrid> → <NftCard> × N
```

### Key files

```
packages/contracts/
├── src/MockNFT.sol                        — ERC721 + Enumerable contract
├── script/DeployMockNFT.s.sol             — Forge deploy + mint script
├── test/MockNFT.t.sol                     — Unit + fuzz tests
└── nft-assets/generate.mjs               — Image & metadata generator

packages/frontend/src/
├── lib/
│   ├── wagmi.ts                           — Wagmi v2 + RainbowKit config
│   ├── contracts.ts                       — ABI + deployment loader
│   └── ipfs.ts                            — IPFS URL resolver + metadata fetcher
├── hooks/
│   └── useNfts.ts                         — Main data-fetching hook
├── components/
│   ├── Web3Providers.tsx                  — Wagmi + QueryClient + RainbowKit
│   ├── NftGrid.tsx                        — Grid layout + loading/error states
│   └── NftCard.tsx                        — Individual NFT card
└── app/
    ├── layout.tsx                         — Root layout with providers
    └── page.tsx                           — Home page
```

---

## Available Scripts

### Contracts (`packages/contracts`)

```bash
npm run anvil          # Start local Anvil blockchain (chainId 31337)
npm run deploy:local   # Deploy MockNFT + mint test tokens + copy deployment.json
npm run test           # Run Forge unit & fuzz tests
```

### Frontend (`packages/frontend`)

```bash
npm run dev            # Start Next.js dev server on http://localhost:3000
npm run build          # Production build
npm run start          # Serve production build
```

### Root

```bash
npm run dev            # Alias for frontend dev server
npm run anvil          # Alias for contracts anvil
npm run deploy:local   # Alias for contracts deploy
```

---

## Concepts Covered

- **ERC721 & ERC721Enumerable** — token ownership, enumeration, and `tokenURI`
- **Foundry workflow** — `forge build`, `forge test`, `forge script`, Anvil local node
- **IPFS content addressing** — CIDs, pinning, local gateway, `ipfs://` URI scheme
- **Wagmi v2 hooks** — `useReadContract`, `useReadContracts`, `useAccount`
- **TanStack Query** — `useQuery`, `useQueries`, caching strategy, parallel fetching
- **RainbowKit** — wallet connection modal, network switching, `ConnectButton`
- **Next.js App Router** — Server vs Client Components, the `"use client"` boundary, providers in layouts
- **CORS** — why it matters for local dev and how to configure gateway headers

---

## Troubleshooting

**`deployment.json not found`**
→ Run `npm run deploy:local` in `packages/contracts`. This generates the file and copies it to `packages/frontend/public/`.

**`baseTokenURI still contains the placeholder`**
→ Run `generate.mjs`, copy the printed metadata CID, paste it into `DeployMockNFT.s.sol`, then redeploy.

**Images not loading / CORS error**
→ Make sure `ipfs daemon` is running and the gateway CORS config only contains `http://localhost:3000` (not multiple origins). Re-run the `ipfs config` commands from the setup section.

**`Chain: Unknown`** in MetaMask
→ Add the Anvil network manually using the settings in the "Connecting MetaMask" section above.

**Anvil state reset after restart**
→ Anvil's state is ephemeral. After restarting Anvil you must redeploy: `npm run deploy:local`.

---

## License

MIT