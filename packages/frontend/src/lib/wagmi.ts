import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { anvil, sepolia } from "wagmi/chains";

/**
 * RainbowKit's `getDefaultConfig` is the Wagmi v2-native way to configure
 * chains, connectors, and transports in one call.
 *
 * It internally creates a Wagmi config using `createConfig`, so you do NOT
 * need to call `createConfig` separately.
 */
export const wagmiConfig = getDefaultConfig({
  // Shown inside RainbowKit's connect modal
  appName: "NFT Viewer",

  // Get a free projectId at https://cloud.walletconnect.com
  // For local-only dev you can use this placeholder, but WalletConnect
  // features (mobile QR, etc.) won't work without a real one.
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "YOUR_PROJECT_ID",

  chains: [
    anvil,    // Local Foundry node  — chainId 31337, rpc http://localhost:8545
    sepolia,  // Public testnet      — for future phases
  ],

  // No custom transports needed: Wagmi will use the default public RPC
  // for each chain. For production you'd point these at Alchemy/Infura.
  ssr: true, // Required for Next.js App Router (avoids hydration mismatch)
});