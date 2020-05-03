export const IS_DEV = process.env.NODE_ENV !== 'production'

export const TOMO_COIN_TYPE = 889

export const SITE_MAP = {
  Authentication: '/login',
  Home: '/',
  Profile: '/profile',
  Orders: '/orders',
  Relayers: '/relayers',
  Register: '/register',
  Dashboard: '/dashboard',
  Logout: '/logout',
}

export const UNLOCK_WALLET_METHODS = {
  TomoWallet: 'Tomo Wallet',
  LedgerWallet: 'Ledger Wallet',
  TrezorWallet: 'Trezor Wallet',
  BrowserWallet: 'MetaMask',
  SoftwareWalletPrivate: 'Private Key',
  SoftwareWalletMnemonic: 'Mnemonic',
}

export const MISC = {
  MinimumDeposit: 25000,
  AuthMessage: process.env.REACT_APP_SIGNATURE_MESSAGE,
}

export const I18N_LANGS = [{ value: 'en', label: 'EN' }, { value: 'vn', label: 'VN' }, { value: 'jp', label: 'JP' }]

export const STORAGE_ITEMS = {
  user: '__tomorelayer__user__',
}

export const STANDARD_ERC20_ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        name: '',
        type: 'uint8',
      },
    ],
    payable: false,
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        name: '',
        type: 'string',
      },
    ],
    payable: false,
    type: 'function',
  },
]

export const LENDING_ABI = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"COLLATERALS","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ORACLE_PRICE_FEEDER","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"term","type":"uint256"}],"name":"addTerm","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"LENDINGRELAYER_LIST","outputs":[{"name":"_tradeFee","type":"uint16"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"Relayer","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"TomoXListing","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"coinbase","type":"address"},{"name":"tradeFee","type":"uint16"},{"name":"baseTokens","type":"address[]"},{"name":"terms","type":"uint256[]"},{"name":"collaterals","type":"address[]"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MODERATOR","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"depositRate","type":"uint256"},{"name":"liquidationRate","type":"uint256"},{"name":"recallRate","type":"uint256"}],"name":"addILOCollateral","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"coinbase","type":"address"},{"name":"tradeFee","type":"uint16"}],"name":"updateFee","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"moderator","type":"address"}],"name":"changeModerator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"TERMS","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"BASES","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"COLLATERAL_LIST","outputs":[{"name":"_depositRate","type":"uint256"},{"name":"_liquidationRate","type":"uint256"},{"name":"_recallRate","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"}],"name":"addBaseToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"lendingToken","type":"address"},{"name":"price","type":"uint256"}],"name":"setCollateralPrice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"ILO_COLLATERALS","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"feeder","type":"address"}],"name":"changeOraclePriceFeeder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"depositRate","type":"uint256"},{"name":"liquidationRate","type":"uint256"},{"name":"recallRate","type":"uint256"}],"name":"addCollateral","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"},{"name":"lendingToken","type":"address"}],"name":"getCollateralPrice","outputs":[{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"coinbase","type":"address"}],"name":"getLendingRelayerByCoinbase","outputs":[{"name":"","type":"uint16"},{"name":"","type":"address[]"},{"name":"","type":"uint256[]"},{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"r","type":"address"},{"name":"t","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]
