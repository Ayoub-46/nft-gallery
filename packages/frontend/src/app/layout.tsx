import type { Metadata } from "next";
import { Web3Providers } from "@/components/Web3Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "NFT Viewer",
  description: "View your NFT collection on-chain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        {/*
          Web3Providers is a Client Component, but we can import it here in a
          Server Component. Next.js will automatically split the bundle at that
          boundary — the layout shell stays server-rendered, the providers
          hydrate on the client.
        */}
        <Web3Providers>{children}</Web3Providers>
      </body>
    </html>
  );
}