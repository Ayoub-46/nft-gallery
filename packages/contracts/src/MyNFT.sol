// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockNFT
 * @notice A simple ERC721 contract for local development and testing.
 * @dev Extends ERC721Enumerable so we can easily query tokens by owner index,
 *      which our frontend will use to build the NFT grid.
 */
contract MockNFT is ERC721, ERC721Enumerable, Ownable {
    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    /// @notice Auto-incrementing token ID counter (starts at 1)
    uint256 private _nextTokenId;

    /// @notice Base URI for token metadata (points to a local or IPFS folder)
    string private _baseTokenURI;

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event BatchMinted(address indexed to, uint256 startId, uint256 endId);

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI;
        _nextTokenId = 1; // Start token IDs at 1, not 0
    }

    // -------------------------------------------------------------------------
    // Minting
    // -------------------------------------------------------------------------

    /**
     * @notice Mint a single NFT to `to`.
     * @dev Only callable by the contract owner (the deployer on Anvil).
     */
    function mint(address to) external onlyOwner returns (uint256 tokenId) {
        tokenId = _nextTokenId;
        _nextTokenId++;
        _safeMint(to, tokenId);
    }

    /**
     * @notice Mint `quantity` NFTs to `to` in a single transaction.
     * @dev Useful for quickly setting up a wallet with many test NFTs.
     */
    function batchMint(
        address to,
        uint256 quantity
    ) external onlyOwner {
        require(quantity > 0 && quantity <= 50, "MockNFT: quantity out of range");

        uint256 startId = _nextTokenId;

        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(to, _nextTokenId);
            _nextTokenId++;
        }

        emit BatchMinted(to, startId, _nextTokenId - 1);
    }

    // -------------------------------------------------------------------------
    // Metadata
    // -------------------------------------------------------------------------

    /**
     * @notice Update the base URI (owner only).
     */
    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    /// @inheritdoc ERC721
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // -------------------------------------------------------------------------
    // View helpers (used by the frontend)
    // -------------------------------------------------------------------------

    /**
     * @notice Returns all token IDs owned by `owner`.
     * @dev Iterates using ERC721Enumerable. Fine for a local dev/test contract;
     *      for production you'd want an off-chain indexer instead.
     */
    function tokensOfOwner(
        address owner
    ) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }

        return tokens;
    }

    /**
     * @notice Returns the total number of tokens minted so far.
     */
    function totalMinted() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    // -------------------------------------------------------------------------
    // Required overrides (ERC721 + ERC721Enumerable conflict resolution)
    // -------------------------------------------------------------------------

    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}