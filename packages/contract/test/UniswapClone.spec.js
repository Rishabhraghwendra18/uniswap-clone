const { expect } = require("chai");
const { ethers} = require("hardhat");
const {etherToWei, weiToEther} = require('../utils');

describe('Uniswap Clone Contract', function(){
  let uniswapClone,erc20Token,ucToken,owner,owner2;
  before(async()=>{
    [owner,owner2] = await ethers.getSigners();
    // Deploying ERC20 token
    const UCToken = await ethers.getContractFactory("UniswapCloneLiquidityProviderToken");
    ucToken = await UCToken.deploy();
    const BallonsToken = await ethers.getContractFactory("USDC");
    erc20Token = await BallonsToken.deploy();
  
    // Deploying Uniswap Clone Contract
    const UniswapClone = await ethers.getContractFactory("UniswapClone");
    uniswapClone = await UniswapClone.deploy(erc20Token.address,ucToken.address);

    // funding uniswap contract
    console.log("owner: ",ethers.utils.formatEther(await owner.getBalance()))
    await owner.sendTransaction({
      to: uniswapClone.address,
      value: ethers.utils.parseEther("1000")
    });
    await erc20Token.transfer(uniswapClone.address,ethers.utils.parseEther('1000'));
    await erc20Token.transfer(owner2.address,ethers.utils.parseEther('10000'));
    await uniswapClone.init();
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
  it("should able to swap matic -> USDC", async ()=>{
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
  it("should able to swap USDC -> matic", async ()=>{
    const ownerBeforeBallonsBalance = await erc20Token.balanceOf(owner.address);
    const ownerBeforeMaticBalance = await owner.getBalance();
    await erc20Token.approve(uniswapClone.address,ethers.utils.parseEther('1'));

    await uniswapClone.tokenToMatic(ethers.utils.parseEther('1'));

    const ownerAfterBallonsBalane = await erc20Token.balanceOf(owner.address);
    const ownerAfterMaticBalance = await owner.getBalance();
    expect(ownerAfterBallonsBalane).lessThan(ownerBeforeBallonsBalance);
    expect(ownerAfterMaticBalance).greaterThan(ownerBeforeMaticBalance);
  });

  it("Should able to deposit token and get LP tokens", async ()=>{
    const ownerUCTokenBalance = await ucToken.balanceOf(owner2.address);
    expect(ownerUCTokenBalance).to.equal(0,'User balance is not equal to zero');

    await erc20Token.connect(owner2).approve(uniswapClone.address,ethers.utils.parseEther("100"));
    await uniswapClone.connect(owner2).deposit({value: ethers.utils.parseEther("1")});

    const ownerAfterDeposit = await ucToken.balanceOf(owner2.address);
    expect(ownerAfterDeposit).to.greaterThan(0, "User balance not greater than 0");
  });

  it("Should able to withdraw LP tokens", async ()=>{
    const ownerUCTokenBalance = await ucToken.balanceOf(owner2.address);
    expect(ownerUCTokenBalance).to.greaterThan(0,'User balance is equal to zero');

    await ucToken.connect(owner2).approve(uniswapClone.address,ethers.utils.parseEther("10"));
    await uniswapClone.connect(owner2).withdraw(ethers.utils.parseEther("10"));

    const ownerAfterWithdraw = await ucToken.balanceOf(owner2.address);
    expect(ownerAfterWithdraw).to.lessThan(ownerUCTokenBalance, "User balance not less than previous balance");
  });
})
