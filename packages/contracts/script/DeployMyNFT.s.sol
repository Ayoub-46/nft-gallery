// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import {MockNFT} from "../src/MyNFT.sol";

contract DeployMockNFT is Script {
    address constant ANVIL_ACCOUNT_0 = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address constant ANVIL_ACCOUNT_1 = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;

    function run() external {
        vm.startBroadcast();

        // ✅ Paste the CID printed by generate.mjs here — only one place to update
        string memory baseTokenURI = "ipfs://QmRgsmowdbueBgaex2YzrXUVgTxQNfjM3AZ1VFbkCVWL83/";

        MockNFT nft = new MockNFT("MockNFT", "MNFT", baseTokenURI);
        console.log("MockNFT deployed at:", address(nft));

        nft.batchMint(ANVIL_ACCOUNT_0, 5);
        nft.batchMint(ANVIL_ACCOUNT_1, 3);

        vm.stopBroadcast();

        // Save both the address AND the baseURI so the frontend can read them
        string memory json = string(abi.encodePacked(
            '{"MockNFT":"', vm.toString(address(nft)), '"',
            ',"baseTokenURI":"', baseTokenURI, '"}'
        ));
        vm.writeFile("./deployments/local.json", json);
        console.log("Written to deployments/local.json");
    }
}