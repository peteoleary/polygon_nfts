pragma solidity >=0.6.0 <0.7.0;
//SPDX-License-Identifier: MIT

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
//learn more: https://docs.openzeppelin.com/contracts/3.x/erc721

// GET LISTED ON OPENSEA: https://testnets.opensea.io/get-listed/step-two

contract FirepiePizzaToken is ERC721, Ownable {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() public ERC721("FirepiePizzaToken", "FRPT") {
    _setBaseURI("http://firepie-nft.s3-website-us-east-1.amazonaws.com/");
  }

  function contractURI() public view returns (string memory) {
        return "http://firepie-nft.s3-website-us-east-1.amazonaws.com/FRPT.json";
    }

  function mintItem(address to, string memory tokenURI)
      public
      onlyOwner
      returns (uint256)
  {
      _tokenIds.increment();

      uint256 id = _tokenIds.current();
      _mint(to, id);
      _setTokenURI(id, tokenURI);

      return id;
  }
}
