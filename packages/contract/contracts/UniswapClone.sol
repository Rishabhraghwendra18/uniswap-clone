// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

//1. Function for deposit to pool
//2. Function for widthraw from pool
//3. Function to swap
//4. Function to predict price for swap
contract UniswapClone{
    IERC20 public token;
    uint256 public totalLiquidity;
    mapping (address => uint) liquidityProviders;
    event MaticToToken(address sender,uint256 tokenValue);
    event TokenToMatic (address sender,uint256 maticAmount);
    event Deposited(address sender,uint256 liquidityMinted,uint256 tokenValue,uint256 maticValue);
    event Withdraw(uint256 tokenValue,uint256 maticValue);
    constructor(IERC20 _token){
        token = _token;
    }
    function deposit(uint256 amount) public payable returns (uint256){
        uint256 ethReserve = address(this).balance - msg.value; 
        uint256 tokenReserve = token.balanceOf(address(this));
        uint256 tokenDeposit;

        tokenDeposit = ((msg.value * tokenReserve) / ethReserve) + 1; 
        uint256 liquidityMinted = (msg.value*totalLiquidity) / ethReserve;
       liquidityProviders[msg.sender] =liquidityProviders[msg.sender]+liquidityMinted;
        totalLiquidity = totalLiquidity + liquidityMinted;

        require(token.transferFrom(msg.sender, address(this), tokenDeposit));
        emit Deposited(msg.sender, liquidityMinted, msg.value, tokenDeposit);
        return tokenDeposit;

    }
    function withdraw(uint256 tokenAmount) public returns (bool) {
        require(liquidityProviders[msg.sender]>=tokenAmount,"Sender doesn't have specified amount");

    }
    function price(uint256 xToken,uint256 xTokenReserve,uint256 yTokenReserve) public pure returns (uint256) {
        uint256 xTokenAddedToReserve = xTokenReserve+xToken;
        uint256 numerator = xTokenReserve * yTokenReserve;
        uint256 yTokenLeftInReserve = numerator/xTokenAddedToReserve;
        uint256 yTokenOutput = yTokenReserve - yTokenLeftInReserve;
        return yTokenOutput;
    }
    function maticToToken() payable public {
        require(msg.value> 0,"Matic value should be greater than 0");
        uint256 xTokenReserve = address(this).balance;
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
        (bool success,) = msg.sender.call{value:tokenOutput}("");
        require(success,"Failed to send you matic");
        emit TokenToMatic(msg.sender,tokenOutput);
    }
}
