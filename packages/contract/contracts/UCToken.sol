// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UniswapCloneLiquidityProviderToken is ERC20{
    constructor() ERC20("Uniswap Clone Liquidity Token", "UC") {
        _mint(msg.sender, 10000000 ether);
    }
    function mint(address _to,uint _value) public {
        _mint(_to,_value);
    }
    function burnFrom(address _from,uint256 _value)external {
        require(allowance(_from,msg.sender)== _value,"Not enough allowance");
        _burn(_from,_value);
    }
}