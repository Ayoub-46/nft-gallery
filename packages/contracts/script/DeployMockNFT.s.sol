// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockNFT.sol";

contract DeployMockNFT is Script {
    // Clé privée par défaut du compte #0 d'Anvil
    uint256 constant ANVIL_PRIVATE_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    function run() external {
        // TODO (Exercice 1) : 
        // 1. Déclarez une variable string pour l'URI IPFS (générée à la question 1).
        // 2. Utilisez vm.startBroadcast(ANVIL_PRIVATE_KEY).
        // 3. Déployez une nouvelle instance de MockNFT.
        // 4. (Optionnel) Mintez quelques NFTs pour tester avec nft.batchMint(...).
        // 5. Utilisez vm.stopBroadcast().
        // 6. Sauvegardez l'adresse du contrat au format JSON dans "./deployments/local.json" en utilisant vm.writeFile().
        
    }
}
