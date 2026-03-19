"use client";

// TODO (Exercice 4) : Importez ConnectButton de "@rainbow-me/rainbowkit"
// TODO (Exercice 4) : Importez le hook useAccount depuis "wagmi"

import { NftGrid } from "@/components/NftGrid";

export default function HomePage() {
  // TODO (Exercice 4) : Utilisez useAccount() pour extraire `address`, `isConnected` et `chain`
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-start gap-8 p-8 pt-20">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-white">Galerie NFT</h1>
        <p className="text-gray-400 text-sm">Master 1 Sécurité - Connectez votre portefeuille</p>
      </div>

      {/* TODO (Exercice 4) : Placez le ConnectButton ici */}

      {/* TODO (Exercice 4) : Remplacez "false" par la variable isConnected */}
      {false && (
        <div className="w-full max-w-7xl flex flex-col items-center gap-8">
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6 text-sm space-y-2 w-full max-w-md">
            <div className="flex justify-between">
              <span className="text-gray-500">Adresse</span>
              {/* TODO : Afficher l'adresse ici */}
              <span className="text-indigo-400 font-mono text-xs">0x...</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Réseau</span>
              {/* TODO : Afficher le nom du réseau ici */}
              <span className="text-emerald-400 font-mono text-xs">Nom du réseau</span>
            </div>
          </div>

          <NftGrid />
        </div>
      )}
    </main>
  );
}
