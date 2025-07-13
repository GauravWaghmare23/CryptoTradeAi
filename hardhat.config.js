require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    // Shardeum Sphinx Testnet
    shardeum_testnet: {
      url: "https://sphinx.shardeum.org/",
      chainId: 8081,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 20000000000, // 20 gwei
      gas: 8000000
    },
    // Ethereum Sepolia Testnet (for comparison)
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      chainId: 11155111,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    // Local Hardhat network
    hardhat: {
      chainId: 31337,
      accounts: {
        count: 10,
        accountsBalance: "10000000000000000000000" // 10,000 ETH
      }
    }
  },
  etherscan: {
    apiKey: {
      shardeum_testnet: "abc", // Placeholder, Shardeum may not support verification yet
      sepolia: process.env.ETHERSCAN_API_KEY
    },
    customChains: [
      {
        network: "shardeum_testnet",
        chainId: 8081,
        urls: {
          apiURL: "https://explorer-sphinx.shardeum.org/api",
          browserURL: "https://explorer-sphinx.shardeum.org"
        }
      }
    ]
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD"
  }
};