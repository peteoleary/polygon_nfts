/* eslint no-use-before-define: "warn" */
const fs = require("fs");
const { config, ethers } = require("hardhat");
const { utils } = require("ethers");
const axios = require('axios')
require('dotenv').config()

const delayMS = 5000 //sometimes xDAI needs a 6000ms break lol 😅

const getExistingNFTs = async (address) => {

  let existingNFTS = {}
  let offset = 0

  const chain = 'polygon'

  while (true) {
    
    const response = await axios( {
      method: 'get',
      url: `https://deep-index.moralis.io/api/v2/nft/${address}?chain=${chain}&format=decimal&offset=${offset}`,
      headers: {
        'accept': 'application/json',
        'X-API-Key': process.env.MORALIS_API_KEY
      }
    })

    for (const nft of response.data.result) {
      existingNFTS[nft.token_uri] = nft
    }

    if (parseInt(response.data.total) < response.data.page_size) {
      break
    }

    offset += response.page_size
  }
  
  return existingNFTS
}

const main = async (count, skip) => {

  // ADDRESS TO MINT TO:
  // const toAddress = "0x00f6a8a7c146827a89de9ba33eda5ba10ee0d7c4"

  const { deployer } = await getNamedAccounts();

  console.log("\n\n 🎫 Minting from " + deployer + "...\n");

  const toAddress = deployer

  console.log("\n\n 🎫 Minting to "+toAddress+"...\n");

  const yourCollectible = await ethers.getContract("FirepiePizzaToken", deployer);

  const collectibleOwner = await yourCollectible.owner()

  console.log(`collectibleOwner=${collectibleOwner}`)

  const existingNFTs = await getExistingNFTs(yourCollectible.address)

  console.log(`existingNFTs.length=${Object.keys(existingNFTs).length}`)

  // TODO: pass in command line arguement
  const lines = fs.readFileSync('/Users/pete_o/Documents/Dev/crypto/2022-pizza-nft/20220403_upload_random.txt').toString().split('\n')

  for (const line of lines) {
    
    if (line.length == 0 || count == 0) break

    if (skip != 0) {
      skip -= 1
      continue
    }

    const existing = existingNFTs[line]

    if (existing) {
      console.log(`url already minted ${line}`)
      continue
    }

    const url = new URL(line)
    console.log("Minting NFT (" + url.pathname.slice(1) + ")")
    
    let retry = 3

    while (retry-- > 0) {
      try {
        const result = await yourCollectible.mintItem(toAddress,url.pathname.slice(1))

        console.log(`count=${count} result.nonce=${result.nonce} result.gasLimit=${result.gasLimit} result.gasPrice=${result.gasPrice}`)
    
        count -= 1

        break

      } catch (error) {

        console.log(error)
        await sleep(delayMS)
        
      }
    }
    

    await sleep(delayMS)

    // console.log("Transferring Ownership of yourCollectible to "+toAddress+"...")

    // await yourCollectible.transferOwnership(toAddress)

    // await sleep(delayMS)
  }
  
  //await sleep(delayMS)

  // console.log("Transferring Ownership of YourCollectible to "+toAddress+"...")

  // await yourCollectible.transferOwnership(toAddress)

  // await sleep(delayMS)

  /*


  console.log("Minting zebra...")
  await yourCollectible.mintItem("0xD75b0609ed51307E13bae0F9394b5f63A7f8b6A1","zebra.jpg")

  */


  //const secondContract = await deploy("SecondContract")

  // const exampleToken = await deploy("ExampleToken")
  // const examplePriceOracle = await deploy("ExamplePriceOracle")
  // const smartContractWallet = await deploy("SmartContractWallet",[exampleToken.address,examplePriceOracle.address])



  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */


  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */


  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// TODO: add command line arguments

main(50, 0)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
