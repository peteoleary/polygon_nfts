// File: contracts/WisdomHubMulti.sol
// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FirepiePizzaToken is ERC1155, Ownable {
    uint256 public constant WISDOM = 0;
 
    constructor() ERC1155("https://raw.githubusercontent.com/BDU-NFT-Course/NFT-Metadata/main/sample-stones-erc1155/{id}.json"){
        _mint(msg.sender,WISDOM,2,"");
    }

    function mint(address account, uint256 id, uint256 amount) public onlyOwner {
        _mint(account, id, amount, "");
    }

    function burn(address account, uint256 id, uint256 amount) public {
        require(msg.sender == account);
        _burn(account, id, amount);
    }

    function contractURI() public pure returns (string memory) {
        return "https://raw.githubusercontent.com/BDU-NFT-Course/NFT-Metadata/main/sample-stones-erc1155/contract-metadata-erc1155.json";
    }

}