export const baseUrl = process.env.STG === 'production' ? 'https://.../' : `http://www.localhost:${process.env.APP_PORT}`

export const SITE_MAP = {
  root: '/',
  dashboard: '/dashboard',
  auth: '/auth',
}
