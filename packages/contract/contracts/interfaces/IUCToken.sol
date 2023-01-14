// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IUCToken  is IERC20{
    function mint(address _to,uint _value)external;
    function burnFrom(address _from,uint256 _value)external;
}