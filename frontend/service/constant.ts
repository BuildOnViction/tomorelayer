// FIXME: when prepare production, fix baseUrl to some environment variable
const { APP_HOST, APP_PORT } = process.env
const baseUrl = `${APP_HOST}:${APP_PORT}`
const apiPrefix = 'api'
const apiBuild = (resource: string) => `${baseUrl}/${apiPrefix}/${resource}`


export const API = {
  register: apiBuild('register'),
  relayers: apiBuild('relayers'),
}

export const SITE_MAP = {
  root: '/',
  dashboard: '/dashboard',
  auth: '/auth',
}

export const ALERT_TYPE = {
  NO_WEB3: 'Cannot find MetaMask!'
}

export const ERROR_TYPE = {
  FETCH_RELAYERS_FAIL: 'Cannot get relayers from server!'
}
