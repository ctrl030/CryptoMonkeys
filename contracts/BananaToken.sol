// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BananaToken is ERC20, Ownable{
    // mapping that stores whether an address has already claimed their free tokens
    mapping(address => bool) hasClaimedTokens;

    constructor() ERC20("BananaToken", "BANANA"){
    }

    // claim tokens by minting to _msgSender(), limited to 1000 tokens per address, one time use
    function getBananas() public{
        // requiring that address has not claimed free tokens yet
        require(hasClaimedTokens[_msgSender()] == false, "You already claimed your free Bananas.");
        // claim limit
        uint256 _claimAmount = 1000;
        uint256 _oldTotalSupply = totalSupply();
        // update mapping
        hasClaimedTokens[_msgSender()] = true;
        // mint tokens, receiver, amount
        _mint(_msgSender(), _claimAmount);
        // to validate that totalSupply is updated properly
        assert(totalSupply() == _oldTotalSupply + _claimAmount);
    }
}