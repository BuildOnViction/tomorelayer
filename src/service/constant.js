export * from './abi'

export const isDev = process.env.NODE_ENV === 'development'

const APP_HOST = isDev ? process.env.REACT_APP_HOST : window.location.origin
const APP_PORT = isDev ? process.env.REACT_APP_PORT : 80
const APP_SOCKET = isDev ? process.env.REACT_APP_SOCKET : window.location.origin.replace('http', 'ws')

export const baseUrl = `${APP_HOST}:${APP_PORT}`
export const socketUrl = `${APP_SOCKET}:${APP_PORT}/socket`
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
