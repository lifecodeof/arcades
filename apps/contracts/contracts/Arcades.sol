// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ScrapToken.sol";

contract Arcades is ERC721, ERC721Burnable, AccessControl {
    using Counters for Counters.Counter;

    event Recycle(address from, uint256 tokenId, uint256 refundAmount);

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;
    ScrapToken public scrapToken;
    string private __baseURI = "https://zi9xsu.deta.dev/assets/";
    uint256 public refundAmount = 1 ether;

    constructor(ScrapToken scrapTokenAddress) ERC721("Arcades", "ARC") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        scrapToken = scrapTokenAddress;
    }

    function _baseURI() internal view override returns (string memory) {
        return __baseURI;
    }

    function setBaseURI(string memory baseURI)
        public
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        __baseURI = baseURI;
    }

    function mint(address to) public payable {
        require(msg.value >= 0.005 ether, "You must pay at least 0,005 BNB");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function withdraw() public onlyRole(DEFAULT_ADMIN_ROLE) {
        payable(msg.sender).transfer(address(this).balance);
    }

    // The following functions are overrides required by Solidity.
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function recycle(uint256 tokenId) public {
        _burn(tokenId);
        scrapToken.mint(msg.sender, refundAmount);
        emit Recycle(msg.sender, tokenId, refundAmount);
    }

    function setRefundAmount(uint256 amount) public onlyRole(DEFAULT_ADMIN_ROLE) {
        refundAmount = amount;
    }

    function getCount() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
}
