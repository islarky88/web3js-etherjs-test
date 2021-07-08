// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract AceToken {
    
    address public minter;
    mapping (address => uint) public balances;
    
    constructor() {
        minter = msg.sender;   
    }


    function mint(address receiver, uint amount) public {
        require(msg.sender == minter);
       balances[receiver] += amount;
    }
    
    function send(address receiver, uint amount) public {
        require(amount <= balances[msg.sender], "Insufficient Balance");
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
    }

}