// SPDX-License-Identifier: MIT

pragma solidity ^0.8.14;

contract Bank { 

    address public owner; // Declares a state variable 'owner' of type 'address' which will store the address of the contract's owner. The 'public' keyword makes this variable accessible from outside the contract.

    event Deposited(uint256 amount, address indexed sender); // Declares an event 'Deposited' that logs the amount deposited and the address of the sender. The 'indexed' keyword allows for filtering by the sender's address in the event logs.

    event Withdrawn(uint256 amount, address indexed sender); // Declares an event 'Withdrawn' that logs the amount withdrawn and the address of the sender.

    event WithdrawnAll(uint256 amount, address indexed owner); // Declares an event 'WithdrawnAll' that logs the total amount withdrawn by the owner.

    mapping(address => uint256) private balances; // Declares a state variable 'balances' that maps addresses to their corresponding balances. The 'private' keyword makes this variable accessible only within the contract.
    

    
    // The constructor is a special function that is executed only once when the contract is deployed.
    constructor() {
        owner = msg.sender; // Sets the owner of the contract to the address that deployed it (the address that sent the transaction).
    }

    
    // A public function that allows users to deposit funds into the contract. The 'external' keyword means this function can be called from outside the contract. The 'payable' keyword indicates that this function can accept Ether.
    function depositFunds() external payable {
        
        require(msg.value > 0, "Deposit amount must be greater than zero"); // Ensures that the amount of Ether sent with the transaction is greater than zero. If not, it reverts the transaction with an error message.
        balances[msg.sender] += msg.value; // Increases the balance of the sender by the amount of Ether sent.
        emit Deposited(msg.value, msg.sender); // Emits the 'Deposited' event, logging the amount deposited and the sender's address.
    }


    // A public function that allows users to withdraw a specific amount of funds. The amount to be withdrawn is specified in Wei (1 Ether = 10^18 Wei).
    function withdrawFunds(uint256 amountInWei) external {
        require(balances[msg.sender] >= amountInWei, "Insufficient balance"); // Ensures that the sender has enough balance to cover the withdrawal. If not, it reverts the transaction with an error message.
        balances[msg.sender] -= amountInWei; // Decreases the sender's balance by the amount to be withdrawn. This follows the Checks-Effects-Interactions pattern to prevent reentrancy attacks.
        (bool sent, ) = msg.sender.call{value: amountInWei}(""); // Sends the specified amount of Ether to the sender's address. The 'call' function is a low-level function to send Ether. The 'sent' variable will be true if the Ether transfer is successful.
        require(sent, "Failed to send Ether"); // Ensures that the Ether transfer was successful. If not, it reverts the transaction with an error message.
        emit Withdrawn(amountInWei, msg.sender); // Emits the 'Withdrawn' event, logging the amount withdrawn and the sender's address.
    }
    
    
    // A public function that allows users to check their balance. The 'view' keyword indicates that this function does not modify the state of the contract. It returns a value of type uint256.
    function balanceCheck() external view returns (uint256) {
        return balances[msg.sender]; // Returns the balance of the sender.
    }
}
