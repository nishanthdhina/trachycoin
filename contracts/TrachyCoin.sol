// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TrachyCoin is ERC20, Ownable {
    constructor() ERC20("TrachyCoin", "TRCHY") Ownable(msg.sender) {
        // Mint 1 million tokens to the contract creator
        // 18 decimals is the standard for ERC20 tokens
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
} 
