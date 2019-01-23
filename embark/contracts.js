const secrets = require('../secrets.json')

module.exports = {
  default: {
    deployment: {
      host: "localhost",
      port: 8545,
      type: "rpc",
    },
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
          privateKey: secrets.ROPSTEN_OWNER_PRIVATE_KEY,
        },
      ]
    }
  },

  tomonet: {
    deployment: {
      host: secrets.TOMO_ENDPOINT,
      protocol: 'https',
      port: false,
      type: "rpc",
      accounts: [
        {
          privateKey: secrets.TOMO_OWNER_PRIVATE_KEY,
        },
      ]
    }
  },

};
