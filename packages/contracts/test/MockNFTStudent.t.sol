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
