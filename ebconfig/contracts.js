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
          mnemonic: "delay exotic raw small victory scale rate grid bullet uniform tower speak",
          addressIndex: 0,
          numAddresses: 8,
          balance: "900000 ether",
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
        args: [50, 40, 25000],
      },
      Token: { deploy: false, },
      TokenA: {
        fromIndex: 1,
        instanceOf: 'Token',
        args: ["TOKENA", "TOKA", 10000, 0],
      },
      TokenB: {
        fromIndex: 2,
        instanceOf: 'Token',
        args: ["TOKENB", "TOKB", 20000, 0],
      },
      TokenC: {
        fromIndex: 1,
        instanceOf: 'Token',
        args: ["TOKENC", "TOKC", 10000, 0],
      },
      TokenD: {
        fromIndex: 2,
        instanceOf: 'Token',
        args: ["TOKEND", "TOKD", 20000, 0],
      },
    }
  },

  // default environment, merges with the settings in default
  // assumed to be the intended environment by `embark run`
  development: {
    dappConnection: [
      "$WEB3",  // uses pre existing web3 object if available (e.g in Mist)
      "ws://localhost:8546",
      "http://localhost:8545",
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
