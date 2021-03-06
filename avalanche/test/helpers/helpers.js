const fs = require("fs");
const path = require("path");
advanceTime = (time) => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: "2.0",
      method:  "evm_increaseTime",
      params:  [time],
      id:      new Date().getTime()
    }, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

advanceBlock = () => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: "2.0",
      method:  "evm_mine",
      id:      new Date().getTime()
    }, (err, result) => {
      if (err) {
        return reject(err);
      }
      const newBlockHash = web3.eth.getBlock("latest").hash;

      return resolve(newBlockHash);
    });
  });
};

advanceBlocks = async (count) => {
  for (let i = 0; i < count; i++) {
    await advanceBlock();
  }
}

takeSnapshot = () => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: "2.0",
      method:  "evm_snapshot",
      id:      new Date().getTime()
    }, (err, snapshotId) => {
      if (err) {
        return reject(err);
      }
      return resolve(snapshotId);
    });
  });
};

revertToSnapshot = (id) => {
  return new Promise((resolve, reject) => {
    web3.currentProvider.send({
      jsonrpc: "2.0",
      method:  "evm_revert",
      params:  [id],
      id:      new Date().getTime()
    }, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
};

advanceTimeAndBlock = async (time) => {
  await advanceTime(time);
  await advanceBlock();
  return Promise.resolve(web3.eth.getBlock("latest"));
};

makeHex = data => {
  return web3.utils.padRight(web3.utils.asciiToHex(data), 64);
};

wei = data => {
  return String(web3.utils.toWei(String(data)));
};

gwei = data => {
  return String(web3.utils.toWei(String(data), 'gwei'));
};


navax = data => {
  return String(web3.utils.toWei(String(data), 'gwei'));
};

pushToBeacon = async (pool) => {
  const data = fs.readFileSync(path.join(__dirname, "depositdata"), "utf8")
    .slice(8);

  const depositData = web3.eth.abi.decodeParameters(["bytes", "bytes", "bytes", "bytes32"], data);

  return pool.pushToBeacon(depositData[0], depositData[1], depositData[2], depositData[3]);
}

balanceOf = address => {
  const balance = web3.eth.getBalance(address);
  return balance;
};

module.exports = {
  advanceTime,
  advanceBlock,
  advanceTimeAndBlock,
  takeSnapshot,
  revertToSnapshot,
  makeHex,
  pushToBeacon,
  gwei,
  wei,
  navax,
  balanceOf,
  advanceBlocks
};