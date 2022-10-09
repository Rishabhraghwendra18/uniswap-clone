const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
// const { ethers } = require("ethers");

describe('Uniswap Clone Contract', function(){
  async function deployContractsFixtures() {
    // Deploying ERC20 token
    const BallonsToken = await ethers.getContractFactory("Ballons");
    const ballonsToken = await BallonsToken.deploy();

    // Deploying Uniswap Clone Contract
    const UniswapClone = await ethers.getContractFactory("UniswapClone");
    const uniswapClone = await UniswapClone.deploy(ballonsToken.address);

    return {ballonsToken,uniswapClone};
  }
  it("Should get totalLiquidty to zero",async()=>{
    const {uniswapClone} = await loadFixture(deployContractsFixtures);
    expect(await uniswapClone.totalLiquidity()).to.equal(0);
  })
})
