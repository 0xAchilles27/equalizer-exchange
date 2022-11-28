require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require('@typechain/hardhat');
require("dotenv").config({ path: ".env" });

const QUICKNODE_HTTP_URL = process.env.QUICKNODE_HTTP_URL;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PRIVATE_KEY_2 = process.env.PRIVATE_KEY_2;
const PRIVATE_KEY_3 = process.env.PRIVATE_KEY_3;

module.exports = {
  defaultNetwork: "matic",
  networks: {
    hardhat: {
    },
    matic: {
      url: QUICKNODE_HTTP_URL,
      accounts: [PRIVATE_KEY, PRIVATE_KEY_2, PRIVATE_KEY_3]
    }
  },
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
}