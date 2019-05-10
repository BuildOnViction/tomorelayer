require('dotenv').config()

module.exports = {
  // default applies to all environments
  default: {
    // Blockchain node to deploy the contracts
    deployment: {
      host: "localhost", // Host of the blockchain node
      port: 8546, // Port of the blockchain node
      type: "ws", // Type of connection (ws or rpc),
      accounts: [
        {
          mnemonic: process.env.MNEMONIC,
          addressIndex: 0,
          numAddresses: 3,
          balance: "9000 ether",
        }
      ]
    },
    dappConnection: [
      "$WEB3",  // uses pre existing web3 object if available (e.g in Mist)
      "ws://localhost:8546",
      "http://localhost:8545"
    ],
    gas: "auto",
    contracts: {
      RelayerRegistration: {
        fromIndex: 0,
        args: [50],
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

  // default environment, merges with the settings in default
  // assumed to be the intended environment by `embark run`
  development: {
    dappConnection: [
      "ws://localhost:8546",
      "http://localhost:8545",
      "$WEB3"  // uses pre existing web3 object if available (e.g in Mist)
    ]
  },

  // merges with the settings in default
  // used with "embark run privatenet"
  privatenet: {
  },

  // merges with the settings in default
  // used with "embark run testnet"
  testnet: {
  },

  // merges with the settings in default
  // used with "embark run livenet"
  livenet: {
  },

  // you can name an environment with specific settings and then specify with
  // "embark run custom_name" or "embark blockchain custom_name"
  //custom_name: {
  //}
};
