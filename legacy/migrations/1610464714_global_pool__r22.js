const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");
const Config = artifacts.require("Config");

const GlobalPool = artifacts.require("GlobalPool");
const GlobalPool_R22 = artifacts.require("GlobalPool_R22");

module.exports = async function(deployer, accounts) {
  const existing = await GlobalPool.deployed();
  const instance = await upgradeProxy(existing.address, GlobalPool_R22, { deployer });
};
