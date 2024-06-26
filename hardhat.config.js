require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url:  `${process.env.INFURA_POLYGON}`,
      }
    }
  }
};
