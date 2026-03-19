// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {MockNFT} from "../src/MyNFT.sol";

contract MockNFTTest is Test {
    MockNFT public nft;
    address public owner = address(this);
    address public alice = makeAddr("alice");

    function setUp() public {
        nft = new MockNFT("MockNFT", "MNFT", "ipfs://mock-cid/");
    }

    function test_Mint() public {
        uint256 tokenId = nft.mint(alice);
        assertEq(tokenId, 1);
        assertEq(nft.ownerOf(1), alice);
        assertEq(nft.balanceOf(alice), 1);
    }

    function test_BatchMint() public {
        nft.batchMint(alice, 5);
        assertEq(nft.balanceOf(alice), 5);
        assertEq(nft.totalMinted(), 5);
    }

    function test_TokensOfOwner() public {
        nft.batchMint(alice, 3);
        uint256[] memory tokens = nft.tokensOfOwner(alice);
        assertEq(tokens.length, 3);
        assertEq(tokens[0], 1);
        assertEq(tokens[1], 2);
        assertEq(tokens[2], 3);
    }

    function test_OnlyOwnerCanMint() public {
        vm.prank(alice);
        vm.expectRevert();
        nft.mint(alice);
    }

    function test_BaseURI() public {
        nft.mint(alice);
        assertEq(nft.tokenURI(1), "ipfs://mock-cid/1");
    }

    function testFuzz_BatchMintQuantity(uint256 qty) public {
        qty = bound(qty, 1, 50);
        nft.batchMint(alice, qty);
        assertEq(nft.balanceOf(alice), qty);
    }
}