# Hardhat Bank Project

## Description

This project is a smart contract named `Bank` written in Solidity. The contract allows users to deposit, withdraw, and check their balance on the Ethereum blockchain.

## Contract Description

The `Bank` contract includes functionalities to:

- Deposit Ether into the bank.
- Withdraw Ether from the bank.
- Check the balance of a user.
- Manage bank operations securely and efficiently.

## Test Descriptions

The tests are located in the `test/` directory and are designed to verify the functionalities of the `Bank` contract. The tests include:

1. **Deposit Ether**
2. **Withdraw Ether**
3. **Check user balance**
4. **Handle insufficient balance**
5. **Handle non-existent users**
6. **Verify contract security**

For more details about the tests, please refer to the respective test files:

- [bankSepoliaTest.test.js](bankSepoliaTest.test.js)
- [bank.test.js](bank.test.js)
- [bankLocalTest.test.js](bankLocalTest.test.js)

## Requirements

- Node.js
- Yarn
- Hardhat
- Chai

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/rolandolopez36/hardhat-bank.git
   ```

2. Navigate to the project directory:

   ```bash
   cd hardhat-bank
   ```

3. Install the dependencies:

   ```bash
   yarn install
   ```

## Usage

### Compile the Contract

To compile the smart contract, run:

```bash
yarn hardhat compile
```

### Deploy the Contract

To deploy the contract on a local network, run:

```bash
yarn hardhat deploy
```

To deploy the contract on the Sepolia network, ensure your network configuration in `hardhat.config.js` and `.env` are set up correctly, then run:

```bash
yarn hardhat deploy --network sepolia
```

### Run Tests

To run the tests, execute:

```bash
yarn test
```

```bash
yarn test test/bankLocalTest.test.js
```

```bash
yarn test test/bankSepoliaTest.test.js --network sepolia
```

## Configuration

The `hardhat.config.js` file contains the Hardhat configuration for the project. It specifies networks, plugins, and other settings necessary for deployment and testing.

### Environment Variables

Create a `.env` file in the root directory based on `.env.example` and fill in the necessary variables.

## Contributions

Contributions are welcome. Please follow these steps to contribute:

1. Fork the project.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Make the necessary changes and commit them (`git commit -am 'Add new feature'`).
4. Push the changes to your fork (`git push origin feature/new-feature`).
5. Open a Pull Request.

### Additional Tips

- **Keep your fork updated**: Ensure your fork is up-to-date with the original repository to avoid conflicts.
- **Document your changes**: Update documentation and comments in the code if you make significant changes.
- **Follow coding standards**: Adhere to the project's coding conventions and style.

Thank you for contributing!

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
