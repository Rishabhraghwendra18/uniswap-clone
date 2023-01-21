// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IUCToken.sol";

//1. Function for deposit to pool
//2. Function for widthraw from pool
//3. Function to swap
//4. Function to predict price for swap
contract UniswapClone{
    IERC20 public token;
    IUCToken public lpToken;
    uint256 public tokenReserve;
    uint256 public totalLiquidity;
    mapping (address => uint) liquidityProviders;
    event MaticToToken(address sender,uint256 tokenValue);
    event TokenToMatic (address sender,uint256 maticAmount);
    event Deposited(address sender,uint256 liquidityMinted,uint256 tokenValue,uint256 maticValue);
    event Withdraw(address sender, uint256 amount,uint256 ethWithdrawn,uint256 tokenAmount);
    constructor(IERC20 _token,IUCToken _lpToken){
        token = _token;
        lpToken = _lpToken;
    }
    function init() public {
        uint contractBalance = address(this).balance;
        tokenReserve = token.balanceOf(address(this));
        uint liquidityMinted = tokenReserve* contractBalance;
        liquidityProviders[address(0)]+= liquidityMinted;
        totalLiquidity +=liquidityMinted;
    }
    receive() external payable{}
    function getTokenDepositAmount(uint inputToken) public view returns (uint) {
        uint256 ethReserve = address(this).balance; 
        return ((inputToken * tokenReserve) / ethReserve) + 1;
    }
    function deposit() public payable returns (uint256){
        uint256 ethReserve = address(this).balance - msg.value; 
        uint256 tokenBalance = token.balanceOf(address(this));
        uint256 tokenDeposit;

        tokenDeposit = ((msg.value * tokenReserve) / ethReserve) + 1; 
        uint256 liquidityMinted = (msg.value*totalLiquidity) / ethReserve;
       liquidityProviders[msg.sender] =liquidityProviders[msg.sender]+liquidityMinted;
        totalLiquidity = totalLiquidity + liquidityMinted;
        require(liquidityMinted > 0, "Not enough liquidity minted!");
        require(token.transferFrom(msg.sender, address(this), tokenDeposit));
        lpToken.mint(msg.sender,liquidityMinted);
        emit Deposited(msg.sender, liquidityMinted, msg.value, tokenDeposit);
        return tokenDeposit;

    }
    function withdraw(uint256 amount) public returns (uint256,uint256) {
        require(liquidityProviders[msg.sender] >= amount, "withdraw: sender does not have enough liquidity to withdraw.");
        uint256 ethReserve = address(this).balance;
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 ethWithdrawn;

        ethWithdrawn = (amount*ethReserve) / totalLiquidity;

        uint256 tokenAmount = (amount*tokenReserve) / totalLiquidity;
        liquidityProviders[msg.sender] = liquidityProviders[msg.sender] - amount;
        totalLiquidity = totalLiquidity - amount;
        lpToken.burnFrom(msg.sender,amount);
        (bool sent, ) = payable(msg.sender).call{ value: ethWithdrawn }("");
        require(sent, "withdraw(): revert in transferring eth to you!");
        require(token.transfer(msg.sender, tokenAmount));
        emit Withdraw(msg.sender, amount, ethWithdrawn, tokenAmount);
        return (ethWithdrawn, tokenAmount);

    }
    function price(uint256 xToken,uint256 xTokenReserve,uint256 yTokenReserve) public pure returns (uint256 outputAmount) {
        uint numerator = xToken * yTokenReserve;
        uint denominator = xTokenReserve + xToken;
        outputAmount = numerator / denominator; 
    }
    function maticToToken() payable public {
        require(msg.value> 0,"Matic value should be greater than 0");
        uint256 xTokenReserve = address(this).balance - msg.value;
        uint256 yTokenReserve = token.balanceOf(address(this));
        uint256 tokenOutput = price(msg.value,xTokenReserve,yTokenReserve);
        require(token.transfer(msg.sender,tokenOutput),"Not able to send you tokens");
        emit MaticToToken(msg.sender,tokenOutput);
    }
    function tokenToMatic(uint256 amount) public {
        require(amount >0 ,"token swap amount should be greater than 0");
        uint256 maticReserve = address(this).balance;
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 tokenOutput = price(amount,tokenReserve,maticReserve);
        token.transferFrom(msg.sender,address(this),amount);
        (bool success,) = msg.sender.call{value:tokenOutput}("");
        require(success,"Failed to send you matic");
        emit TokenToMatic(msg.sender,tokenOutput);
    }
}
