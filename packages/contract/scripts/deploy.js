// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

// async function main() {
//   const currentTimestampInSeconds = Math.round(Date.now() / 1000);
//   const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
//   const unlockTime = currentTimestampInSeconds + ONE_YEAR_IN_SECS;

//   const lockedAmount = hre.ethers.utils.parseEther("1");

//   const Lock = await hre.ethers.getContractFactory("Lock");
//   const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

//   await lock.deployed();

//   console.log(
//     `Lock with 1 ETH and unlock timestamp ${unlockTime} deployed to ${lock.address}`
//   );
// }
async function main() {
  const [owner] = await hre.ethers.getSigners();
 const UCToken = await hre.ethers.getContractFactory("UniswapCloneLiquidityProviderToken");
 const ucToken = await UCToken.deploy();

 const USDCToken = await hre.ethers.getContractFactory("USDC");
 const usdcToken = await USDCToken.deploy();

 const UniswapClone = await hre.ethers.getContractFactory("UniswapClone");
 const uniswapClone = await UniswapClone.deploy(usdcToken.address,ucToken.address);

 const tokenAmount = hre.ethers.utils.parseEther("1000");
  owner.sendTransaction({
    to: uniswapClone.address,
    value: tokenAmount
  });

  await usdcToken.transfer(uniswapClone.address,tokenAmount);
  await uniswapClone.init();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
