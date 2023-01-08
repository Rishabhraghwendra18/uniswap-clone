// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Ballons is ERC20{
    constructor() ERC20("Ballons", "BAL") {
        _mint(msg.sender, 10000000 ether);
    }
}