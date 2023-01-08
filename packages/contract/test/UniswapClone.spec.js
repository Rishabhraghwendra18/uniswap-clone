const { expect } = require("chai");
const { ethers} = require("hardhat");
const {etherToWei, weiToEther} = require('../utils');

describe('Uniswap Clone Contract', function(){
  let uniswapClone,erc20Token,owner;
  before(async()=>{
    [owner] = await ethers.getSigners();
    // Deploying ERC20 token
    const BallonsToken = await ethers.getContractFactory("Ballons");
    erc20Token = await BallonsToken.deploy();
  
    // Deploying Uniswap Clone Contract
    const UniswapClone = await ethers.getContractFactory("UniswapClone");
    uniswapClone = await UniswapClone.deploy(erc20Token.address);

    // funding uniswap contract
    console.log("owner: ",ethers.utils.formatEther(await owner.getBalance()))
    await owner.sendTransaction({
      to: uniswapClone.address,
      value: ethers.utils.parseEther("1000")
    });
    await erc20Token.transfer(uniswapClone.address,ethers.utils.parseEther('1000'));
  })
  // it("Should able to Deposit",async()=>{
  //   await erc20Token.approve(uniswapClone.address,etherToWei(1));
  //   const tx = await uniswapClone.deposit({value:etherToWei(1)});
  //   // wait for it to be mined
  //   tx.wait();
  //   // check the event emission
  //   await expect(tx).to.emit("Deposited").withArgs(owner.address,1,etherToWei(1),1);

  // })
  // it("Should able to Withdraw",async()=>{
  //   expect(await uniswapClone.withdraw(etherToWei(1))).to.emit("Withdraw");
  // })
  it("Should able to get the price from price()",async ()=>{
    const xInput = ethers.utils.parseEther("1");
    const xReserves = await erc20Token.balanceOf(uniswapClone.address);
    const yReserves = await ethers.provider.getBalance(uniswapClone.address);
    const tokenOuput = await uniswapClone.price(xInput,xReserves,yReserves);
    expect(parseFloat(await ethers.utils.formatEther(tokenOuput)).toFixed(3)).equal('0.999');
  })
  it("should able to swap matic -> ballons", async ()=>{
    const ownerBeforeBallonsBalance = await erc20Token.balanceOf(owner.address);
    const ownerBeforeMaticBalance = await owner.getBalance();
    await uniswapClone.maticToToken({
      value: ethers.utils.parseEther("1")
    });
    const ownerAfterBallonsBalane = await erc20Token.balanceOf(owner.address);
    const ownerAfterMaticBalance = await owner.getBalance();
    expect(ownerAfterBallonsBalane).greaterThan(ownerBeforeBallonsBalance);
    expect(ownerAfterMaticBalance).lessThan(ownerBeforeMaticBalance);
  });
  it("should able to swap ballons -> matic", async ()=>{
    const ownerBeforeBallonsBalance = await erc20Token.balanceOf(owner.address);
    const ownerBeforeMaticBalance = await owner.getBalance();
    await erc20Token.approve(uniswapClone.address,ethers.utils.parseEther('1'));

    await uniswapClone.tokenToMatic(ethers.utils.parseEther('1'));

    const ownerAfterBallonsBalane = await erc20Token.balanceOf(owner.address);
    const ownerAfterMaticBalance = await owner.getBalance();
    expect(ownerAfterBallonsBalane).lessThan(ownerBeforeBallonsBalance);
    expect(ownerAfterMaticBalance).greaterThan(ownerBeforeMaticBalance);
  })
})
