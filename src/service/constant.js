export const IS_DEV = process.env.NODE_ENV !== 'production'

export const TOMO_COIN_TYPE = 889

export const SITE_MAP = {
  Authentication: '/login',
  Home: '/',
  Orders: '/orders',
  Relayers: '/relayers',
  Register: '/register',
  Dashboard: '/dashboard',
  Logout: '/logout',
}

export const ALERT = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
}

export const UNLOCK_WALLET_METHODS = {
  TomoWallet: 'Tomo Wallet',
  LedgerWallet: 'Ledger Wallet',
  TrezorWallet: 'Trezor Wallet',
  BrowserWallet: 'MetaMask',
  SoftwareWallet: 'Private Key/Mnemonnic',
}

export const Tokenizer = (symbol, address) => ({ symbol, address })

export const TRADABLE_TOKENS = [
  Tokenizer('WTOMO', 'wrappedtomo-address'),
  Tokenizer('TRIIP', 'triip-address'),
]

export const MISC = {
  MinimumDeposit: 25000,
  AvailableTradePairs: [
    'TOMO/TRIIP',
    'TOMO/MAS',
    'TOMO/USD',
 ],
}

export const I18N_LANGS = [
  { value: 'en', label: 'EN' },
  { value: 'vn', label: 'VN' },
  { value: 'jp', label: 'JP' }
]

export const STORAGE_ITEMS = {
  user: '__tomorelayer__user__'
}

export const STANDARD_ERC20_ABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "name": "",
        "type": "uint8"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "name": "",
        "type": "string"
      }
    ],
    "payable": false,
    "type": "function"
  }
]
