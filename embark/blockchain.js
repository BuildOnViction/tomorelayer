module.exports = {
  // NOTE: Only for local development, no need in production
  default: {
    enabled: true,
    rpcHost: "localhost",
    rpcPort: 8545,
    rpcCorsDomain: "*",
    wsRPC: true,
    wsOrigins: "*",
    wsHost: "localhost",
    wsPort: 8546
  },

  development: {
    networkType: "custom",
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
    }
  },
}
