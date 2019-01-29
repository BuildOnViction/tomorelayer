const  APP_HOST = process.env.APP_HOST
const  APP_PORT = process.env.APP_PORT

const baseUrl = `${APP_HOST}:${APP_PORT}`
const apiPrefix = 'api'
const apiBuild = resource => `${baseUrl}/${apiPrefix}/${resource}`

export const API = {
  contracts: apiBuild('contracts'),
  register: apiBuild('register'),
  relayers: apiBuild('relayers'),
}

export const SITE_MAP = {
  Home: '/',
  Orders: '/orders',
  Relayers: '/relayers',
  Registration: '/register',
  Dashboard: '/dashboard',
}

export const ALERT = {
  web3: {
    not_logged_in: 'No active account found on MetaMask',
    meta_mask_unavailable: 'MetaMask not found!',
  },
}

export const ERROR = {
  general: {
    some_error: 'shit happened!',
  },
  api: {
    relayers: 'Cannot get relayers from server!',
  },
  web3: {
    getAccounts: 'Cannot detect current user public key!',
  },
}
