"use client";

import React, { useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/lib/wagmi";

// RainbowKit styles — must be imported somewhere in the client tree
import "@rainbow-me/rainbowkit/styles.css";

/**
 * We instantiate QueryClient *inside* a useState so that each user session
 * gets its own client. If you create it outside the component at module level,
 * it gets shared across requests in SSR, which leaks data between users.
 */
export function Web3Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Don't refetch on window focus — avoids unnecessary RPC calls
            // while switching between your editor and browser.
            refetchOnWindowFocus: false,
            // Keep data fresh for 30 seconds
            staleTime: 30_000,
          },
        },
      })
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#6366f1",       // indigo-500 — matches our UI palette
            accentColorForeground: "white",
            borderRadius: "medium",
          })}
          // Show Anvil in the network switcher inside the connected button
          showRecentTransactions={true}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}