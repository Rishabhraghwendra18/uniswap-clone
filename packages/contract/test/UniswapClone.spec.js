const { expect } = require("chai");
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
    console.log("owner: ",uniswapClone.address)
    await owner.sendTransaction({
      to: uniswapClone.address,
      value: ethers.utils.parseEther("1.0")
    })
  })
  it("Should able to Deposit",async()=>{
    await erc20Token.approve(uniswapClone.address,etherToWei(1));
    expect(await uniswapClone.deposit(etherToWei(1),{value:etherToWei(1)})).to.emit("Deposited");

  })
  it("Should able to Withdraw",async()=>{
    expect(await uniswapClone.withdraw(etherToWei(1))).to.emit("Withdraw");
  })
  
})
