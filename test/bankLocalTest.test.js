// Importing the 'expect' function from the 'chai' library for making assertions in tests.
// 'chai' is an assertion library that allows us to write tests in a readable manner.
const { expect } = require("chai");

// Importing the 'ethers' library from 'hardhat', which provides various utilities for interacting with Ethereum.
// 'hardhat' is a development environment to compile, deploy, test, and debug Ethereum software.
const { ethers } = require("hardhat");

// Describing the test suite for the 'Bank' contract using the 'describe' function from Mocha (the test framework).
// The 'describe' function is used to group related test cases.
describe("Bank Contract on Local Network", function () {
  // Declare variables to hold instances of the contract and some test accounts.
  // 'let' declares a block-scoped local variable, optionally initializing it to a value.
  let Bank; // This will hold the contract factory for the Bank contract.
  let bank; // This will hold the deployed instance of the Bank contract.
  let owner; // This will hold the owner account.
  let addr1; // This will hold the first test account.

  // The 'beforeEach' hook runs before each test case to set up the environment.
  // 'async' allows the use of 'await' within this function to handle asynchronous operations.
  beforeEach(async function () {
    // Get the contract factory for the 'Bank' contract.
    // 'ethers.getContractFactory' is a function that gets the ContractFactory for a contract.
    Bank = await ethers.getContractFactory("Bank");

    // Get the signers (accounts) from the test environment.
    // 'ethers.getSigners' returns an array of account objects to interact with the blockchain.
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy a new instance of the 'Bank' contract using the contract factory.
    // 'Bank.deploy()' deploys a new instance of the contract and returns a Contract object.
    bank = await Bank.deploy();

    // Wait until the contract is deployed.
    // 'bank.deployed()' waits for the deployment transaction to be mined and the contract to be available.
    await bank.deployed();
  });

  // Test case to ensure the contract deploys correctly and sets the owner.
  // 'it' is used to define a single test case.
  it("should deploy the contract and set the owner correctly", async function () {
    // 'expect' is an assertion style from Chai used for making assertions in tests.
    // 'await bank.owner()' retrieves the owner of the deployed contract (an async operation).
    // '.to.equal' is a Chai method that checks if the expected value matches the actual value.
    expect(await bank.owner()).to.equal(owner.address);
  });

  // Test case to check if a user can deposit funds and update their balance.
  it("should allow a user to deposit funds and update their balance", async function () {
    // Check the initial balance of 'addr1' before any deposit.
    // 'bank.connect(addr1).balanceCheck()' calls the balanceCheck function on the Bank contract from addr1's perspective.
    const initialBalance = await bank.connect(addr1).balanceCheck();
    console.log("Initial Balance (deposit):", initialBalance.toString()); // Print the initial balance for debugging.

    // Set the deposit amount to 0.01 Ether.
    // 'ethers.utils.parseEther("0.01")' converts the amount from Ether to Wei (1 Ether = 10^18 Wei).
    const depositAmount = ethers.utils.parseEther("0.01");

    // Deposit 0.01 Ether from 'addr1' into the bank contract.
    // 'bank.connect(addr1).depositFunds({ value: depositAmount })' sends a transaction to the depositFunds function with 0.01 Ether from addr1.
    const tx = await bank.connect(addr1).depositFunds({ value: depositAmount });

    // Wait for the transaction to be mined.
    // 'tx.wait()' waits for the transaction to be confirmed.
    await tx.wait();

    // Check the final balance of 'addr1' after the deposit.
    // Again, 'bank.connect(addr1).balanceCheck()' is called to get the updated balance.
    const finalBalance = await bank.connect(addr1).balanceCheck();
    console.log("Final Balance (deposit):", finalBalance.toString()); // Print the final balance for debugging.

    // Expect the final balance to be the initial balance plus the deposit amount.
    // 'initialBalance.add(depositAmount)' adds the deposit amount to the initial balance.
    expect(finalBalance).to.equal(initialBalance.add(depositAmount));

    // Expect the transaction to emit a 'Deposited' event with the correct arguments.
    // '.to.emit' is a Chai method that checks if the specified event was emitted during the transaction.
    // 'withArgs' verifies the arguments passed to the event.
    await expect(tx)
      .to.emit(bank, "Deposited")
      .withArgs(depositAmount, addr1.address);
  });

  // Test case to check if a user can withdraw funds and update their balance.
  it("should allow a user to withdraw funds and update their balance", async function () {
    // Set the deposit amount to 0.01 Ether and deposit it.
    const depositAmount = ethers.utils.parseEther("0.01");
    await bank.connect(addr1).depositFunds({ value: depositAmount });

    // Check the initial balance of 'addr1' after the deposit.
    const initialBalance = await bank.connect(addr1).balanceCheck();
    console.log("Initial Balance (withdraw):", initialBalance.toString()); // Print the initial balance for debugging.

    // Set the withdraw amount to 0.005 Ether.
    const withdrawAmount = ethers.utils.parseEther("0.005");

    // Withdraw 0.005 Ether from 'addr1's balance.
    const tx = await bank.connect(addr1).withdrawFunds(withdrawAmount);
    await tx.wait(); // Wait for the transaction to be mined.

    // Check the final balance of 'addr1' after the withdrawal.
    const finalBalance = await bank.connect(addr1).balanceCheck();
    console.log("Withdraw Amount:", withdrawAmount.toString()); // Print the withdraw amount for debugging.
    console.log("Final Balance (withdraw):", finalBalance.toString()); // Print the final balance for debugging.
    console.log(
      "Expected Balance after withdraw:",
      initialBalance.sub(withdrawAmount).toString()
    ); // Print the expected balance for debugging.

    // Expect the final balance to be the initial balance minus the withdraw amount.
    expect(finalBalance).to.equal(initialBalance.sub(withdrawAmount));

    // Expect the transaction to emit a 'Withdrawn' event with the correct arguments.
    await expect(tx)
      .to.emit(bank, "Withdrawn")
      .withArgs(withdrawAmount, addr1.address);
  });

  // Test case to check if a user can query their balance.
  it("should allow a user to query their balance", async function () {
    // Set the deposit amount to 0.01 Ether and deposit it.
    const depositAmount = ethers.utils.parseEther("0.01");
    await bank.connect(addr1).depositFunds({ value: depositAmount });

    // Check the balance of 'addr1' after the deposit.
    const balance = await bank.connect(addr1).balanceCheck();
    console.log("Queried Balance:", balance.toString()); // Print the queried balance for debugging.

    // Expect the balance to be equal to the deposit amount.
    expect(balance).to.equal(depositAmount);
  });

  // Test case to ensure depositing zero Ether is not allowed.
  it("should not allow depositing zero Ether", async function () {
    // Expect the deposit of zero Ether to be reverted with an error message.
    // '.to.be.revertedWith' is a Chai method that checks if the transaction is reverted with a specific error message.
    await expect(
      bank.connect(addr1).depositFunds({ value: 0 })
    ).to.be.revertedWith("Deposit amount must be greater than zero");
  });

  // Test case to ensure withdrawing more Ether than the user's balance is not allowed.
  it("should not allow withdrawing more Ether than the user's balance", async function () {
    // Check the initial balance of 'addr1' to use in the withdraw check.
    const initialBalance = await bank.connect(addr1).balanceCheck();
    console.log("Initial Balance (overdraw):", initialBalance.toString()); // Print the initial balance for debugging.

    // Expect the withdrawal of 0.02 Ether to be reverted with an error message due to insufficient balance.
    await expect(
      bank.connect(addr1).withdrawFunds(ethers.utils.parseEther("0.02"))
    ).to.be.revertedWith("Insufficient balance");
  });
});
