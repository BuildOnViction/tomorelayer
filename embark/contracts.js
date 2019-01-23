const secrets = require('../secrets.json')

module.exports = {
  default: {
    deployment: {
      host: "localhost",
      port: 8545,
      type: "rpc",
    },
    dappConnection: [
      "$WEB3",
      "ws://localhost:8546",
      "http://localhost:8545"
    ],
    gas: "auto",
    contracts: {}
  },

  development: {},

  ropsten: {
    deployment: {
      host: secrets.ROPSTEN_ENDPOINT,
      protocol: 'https',
      port: false,
      type: "rpc",
      accounts: [
        {
          privateKey: secrets.OWNER_PRIVATE_KEY,
        },
      ]
    }
  },

};
