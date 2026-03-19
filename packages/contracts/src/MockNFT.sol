// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockNFT
 * @notice A simple ERC721 contract for local development and testing.
 * @dev Extends ERC721Enumerable so we can easily query tokens by owner index,
 *      which our frontend uses to build the NFT grid.
 */
contract MockNFT is ERC721, ERC721Enumerable, Ownable {
    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------

    uint256 private _nextTokenId;
    string private _baseTokenURI;

    // TODO (Part C): Add a public state variable called `mintPrice`
    // It should be of type uint256 and set to 0.01 ether in the constructor.

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
        _nextTokenId = 1;

        // TODO (Part C): initialise mintPrice here
    }

    // -------------------------------------------------------------------------
    // Owner-only minting (do not modify these)
    // -------------------------------------------------------------------------

    function mint(address to) external onlyOwner returns (uint256 tokenId) {
        tokenId = _nextTokenId;
        _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function batchMint(address to, uint256 quantity) external onlyOwner {
        require(quantity > 0 && quantity <= 50, "MockNFT: quantity out of range");
        uint256 startId = _nextTokenId;
        for (uint256 i = 0; i < quantity; i++) {
            _safeMint(to, _nextTokenId);
            _nextTokenId++;
        }
        emit BatchMinted(to, startId, _nextTokenId - 1);
    }

    // -------------------------------------------------------------------------
    // TODO (Part C): Add publicMint() — payable, public, no onlyOwner
    //   - Revert if msg.value != mintPrice
    //   - Mint one token to msg.sender
    //   - Return the token ID
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // TODO (Part C): Add withdraw() — onlyOwner
    //   - Send the contract's entire ETH balance to the owner
    // -------------------------------------------------------------------------

    // -------------------------------------------------------------------------
    // Metadata
    // -------------------------------------------------------------------------

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // -------------------------------------------------------------------------
    // View helpers
    // -------------------------------------------------------------------------

    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokens = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokens;
    }

    function totalMinted() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    // -------------------------------------------------------------------------
    // Required overrides
    // -------------------------------------------------------------------------

    function _update(address to, uint256 tokenId, address auth)
        internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
