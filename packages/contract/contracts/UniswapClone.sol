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
    uint256 public amountOfEth;
    uint256 public amountOfToken;
    constructor(IERC20 _token) public{
        token = _token;
    }
    function deposit(uint256 tokenAmount) public payable returns (bool) {
        require(msg.value >0,"Please send some ether also");
        require(token.balanceOf(address(this))>0,"Please send some tokens too");
        require(token.balanceOf(address(this))/msg.value ==1 , "Please send the tokens and eth in 1:1");
        amountOfEth +=msg.value;
        amountOfToken +=token.balanceOf(address(this));
        totalLiquidity = amountOfEth * amountOfToken;
        return true;
    }
}
