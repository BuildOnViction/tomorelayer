const  APP_HOST = process.env.STG === 'development' ? process.env.APP_HOST : window.location.origin
const  APP_PORT = process.env.STG === 'development' ? process.env.APP_PORT : 80

const baseUrl = `${APP_HOST}:${APP_PORT}`
const apiPrefix = 'api'
const apiBuild = resource => [baseUrl, apiPrefix, resource].join('/')

export const API = {
  contracts: apiBuild('contracts'),
  register: apiBuild('register'),
  relayers: apiBuild('relayers'),
}

export const SITE_MAP = {
  Authentication: '/login',
  Home: '/',
  Orders: '/orders',
  Relayers: '/relayers',
  Registration: '/register',
  Dashboard: '/dashboard',
}

export const ALERT = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
}
