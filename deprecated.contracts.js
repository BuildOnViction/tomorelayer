require('dotenv').config()

module.exports = {
  default: {
    dappConnection: [
      "$WEB3",
      "ws://localhost:8546",
      "http://localhost:8545",
    ],
    gas: "auto",
    contracts: {
      RelayerRegistration: {
        fromIndex: 0,
      },
      Token: { deploy: false, },
      ERC20: { deploy: false },
      ERC20Capped: { deploy: false, },
      ERC20Mintable: { deploy: false, },
      ERC20Detailed: { deploy: false, },
      SafeMath: { deploy: false, },
      Roles: { deploy: false, },
      TokenOne: {
        fromIndex: 1,
        instanceOf: 'Token',
        args: ["TOKEN1", "TOK1", 1000, 0],
      },
      TokenTwo: {
        fromIndex: 2,
        instanceOf: 'Token',
        args: ["TOKEN2", "TOK2", 2000, 0],
      },
    }
  },

  development: {
    dappConnection: [
      "ws://localhost:8546",
      "http://localhost:8545",
      "$WEB3"  // uses pre existing web3 object if available (e.g in Mist)
    ]
  },

  privatenet: {
  },

  testnet: {
  },

  livenet: {
  },

};
