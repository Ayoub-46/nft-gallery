import { getDefaultConfig } from "@rainbow-me/rainbowkit";
// TODO (Exercice 3) : Importez la chaîne 'anvil' depuis "wagmi/chains"

export const wagmiConfig = getDefaultConfig({
  appName: "NFT Viewer",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "YOUR_PROJECT_ID",
  
  // TODO (Exercice 3) : Ajoutez le réseau local dans le tableau ci-dessous
  chains: [], 
  
  // TODO (Exercice 3) : Activez le SSR (Server-Side Rendering) pour Next.js
});
