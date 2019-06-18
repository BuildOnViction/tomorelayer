export const isDev = process.env.NODE_ENV === 'development'

const APP_HOST = isDev ? process.env.REACT_APP_HOST : window.location.origin
const APP_PORT = process.env.REACT_APP_PORT
const APP_SOCKET = isDev ? process.env.REACT_APP_SOCKET : window.location.origin.replace('http', 'ws')

const fixBaseUrl = protocol => isDev ? `${protocol}:${APP_PORT}` : protocol
export const baseUrl = fixBaseUrl(APP_HOST)
export const socketUrl = `${fixBaseUrl(APP_SOCKET)}/socket`
const apiPrefix = 'api'
const apiBuild = resource => [baseUrl, apiPrefix, resource].join('/')

export const API = {
  fetchQRCode: apiBuild('auth?qr_code='),
  token: apiBuild('token'),
  relayer: apiBuild('relayer'),
  contract: apiBuild('contract'),
}

export const TOMO_COIN_TYPE = 889

export const SOCKET_REQ = {
  getQRCode: 'QR_CODE_LOGIN',
}

export const SITE_MAP = {
  Authentication: '/login',
  Home: '/',
  Orders: '/orders',
  Relayers: '/relayers',
  Register: '/register',
  Dashboard: '/dashboard',
}

export const ALERT = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
}

export const UNLOCK_WALLET_METHODS = {
  TomoWallet: 'TomoWallet',
  LedgerWallet: 'LedgerWallet',
  TrezorWallet: 'TrezorWallet',
  BrowserWallet: 'MetaMask/TrustWallet/MidasWallet',
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
  authen: '__tomorelayer__authstore__'
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
