require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
require("hardhat-deploy")
/** @type import('hardhat/config').HardhatUserConfig */

const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY
const RPC_URL = process.env.RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const COINMARKETCAP_APIKEY = process.env.COINMARKETCAP_APIKEY
module.exports = {
  // solidity: "0.8.17",
  solidity:
  {
    compilers: [{ version: "0.8.8" }, { version: "0.6.6" }]
  },
  namedAccounts: {
    deployer: {
      default: 0,
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_APIKEY,
  },
  gasReporter: {
    enabled: true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency: "USD",
    coinmarketcap: COINMARKETCAP_APIKEY,
    token: "ETH"
  },
  defaultNetwork: "hardhat",
  networks: {
    goerli: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 5,
      blockConfirmations: 6
    },
    // local hardhat network node
    local: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    }
  }
};

