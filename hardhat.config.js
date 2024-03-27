require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: 'https://polygon-mumbai.infura.io/v3/7c06285fa5304a50a13aa9d3c5ccc40c'
      }
    }
  }
};
