// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MockNFT.sol";

contract MockNFTTest is Test {
    MockNFT public nft;
    address public admin = makeAddr("admin");
    address public user = makeAddr("user");

    function setUp() public {
        vm.prank(admin);
        nft = new MockNFT("ipfs://mock-cid/");
    }

    function test_OwnerCanMint() public {
        // TODO (Exercice 2 - Test 1) :
        // Simulez l'admin (vm.prank), appelez mint(), et vérifiez (assertEq) 
        // que l'admin possède bien le token ID 1.
    }

    function test_RevertWhen_NonOwnerMints() public {
        // TODO (Exercice 2 - Test 2) :
        // Simulez un utilisateur normal (user), utilisez vm.expectRevert(),
        // puis essayez d'appeler mint().
    }

    function test_RevertWhen_BatchMintExceedsLimit() public {
        // TODO (Exercice 2 - Test 3) :
        // Simulez l'admin. Essayez d'appeler batchMint avec une quantité de 51.
        // Cela doit échouer (revert).
    }
}
