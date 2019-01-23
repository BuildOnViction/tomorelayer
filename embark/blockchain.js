const secrets = require('../secrets.json')

module.exports = {
  // applies to all environments
  default: {
    enabled: true,
    rpcHost: "localhost",
    rpcPort: 8545,
    rpcCorsDomain: "*",
    wsRPC: true,
    wsOrigins: "*",
    wsHost: "localhost",
    wsPort: 8546,
  },

  // default environment, merges with the settings in default
  // assumed to be the intended environment by `embark run` and `embark blockchain`
  development: {
    networkType: "custom", // Can be: testnet, rinkeby, livenet or custom, in which case, it will use the specified networkId
    networkId: "1337",
    isDev: true,
    datadir: ".embark/development/datadir",
    mineWhenNeeded: true,
    nodiscover: true,
    maxpeers: 0,
    proxy: true,
    targetGasLimit: 8000000,
    simulatorMnemonic: "example exile argue silk regular smile grass bomb merge arm assist farm",
    simulatorBlocktime: 0,
    account: {
      // numAccounts: 1,
      // password: "config/development/password",
      // balance: "5 ether",
    }
  },


};
