export const BACKEND_URI = ((env) => {
  switch (env) {
    case 'test':
      return 'http://localhost:8889'
    case 'development':
      return 'http://localhost:8888'
    default:
      return window.location.origin
  }
})(process.env.NODE_ENV)

export const SOCKET_URI = BACKEND_URI.replace('http', 'ws') + '/socket'

export const genericHandler = (response) => {
  if (response.ok) {
    return response.json()
  }
  throw response
}

const defaultHeader = {
  Accept: 'application/json; charset=UTF-8',
}

const HttpClient = () => {
  const headers = {
    ...defaultHeader,
    Authorization: `Bearer ${window.sessionStorage.getItem('tomorelayerAccessToken')}`,
  }

  return {
    get: async (api) =>
      fetch(api, {
        method: 'GET',
        headers,
      }).then(genericHandler),

    post: async (api, value) =>
      fetch(api, {
        method: 'POST',
        body: JSON.stringify(value),
        headers,
      }).then(genericHandler),

    patch: async (api, value) =>
      fetch(api, {
        method: 'PATCH',
        body: JSON.stringify(value),
        headers,
      }).then(genericHandler),

    delete: async (api) =>
      fetch(api, {
        method: 'DELETE',
        headers,
      }).then(genericHandler),
  }
}

export const getPayload = (r) => {
  if (r.payload.token) {
    window.sessionStorage.setItem('tomorelayerAccessToken', r.payload.token)
  }
  return r.payload
}

const logging = async (error) => {
  try {
    return error.json().then((err) => {
      // TODO: if err.code === 500, do something
      return err
    })
  } catch (e) {
    return { error }
  }
}

const ApiFix = (api) => api.replace('.testnet', process.env.REACT_APP_APIFIX)

const API = {
  auth: '/api/auth',
  contract: '/api/contract',
  relayer: '/api/relayer',
  token: '/api/token',
  public: '/api/public',
  external: {
    tomoprice: ApiFix('https://scan.testnet.tomochain.com/api/setting/usd'),
    accountTx: (params) => {
      const { address, page, type } = params
      const baseEndpoint = 'https://scan.testnet.tomochain.com/api/txs/listByAccount'
      return ApiFix(`${baseEndpoint}/${address}?page=${page}&limit=10&tx_type=${type}`)
    },
  },
}

const proxiedAPI = new Proxy(API, {
  get(obj, property) {
    if (process.env.NODE_ENV !== 'production' && property !== 'external') {
      // NOTE: using default development backend with .env.test
      const endpoint = BACKEND_URI + obj[property]
      return endpoint
    }
    return obj[property]
  },
})

/* API ENDPOINTS THAT ACCEPT REQUESTS FROM ORIGIN */
export const getAuthenticated = async (address) =>
  HttpClient()
    .get(`${proxiedAPI.auth}?address=${address}`)
    .then(getPayload)
    .catch(logging)

export const getPublicResource = async () =>
  HttpClient()
    .get(proxiedAPI.public)
    .then(getPayload)
    .catch(logging)

export const getContracts = async () =>
  HttpClient()
    .get(proxiedAPI.contract)
    .then(getPayload)
    .catch(logging)

export const getRelayers = async () =>
  HttpClient()
    .get(proxiedAPI.relayer)
    .then(getPayload)
    .catch(logging)

export const createRelayer = async (relayer) =>
  HttpClient()
    .post(proxiedAPI.relayer, relayer)
    .then(getPayload)
    .catch(logging)

export const updateRelayer = async (relayer) =>
  HttpClient()
    .patch(proxiedAPI.relayer, relayer)
    .then(getPayload)
    .catch(logging)

export const deleteRelayer = async (relayerId) =>
  HttpClient()
    .delete(`${proxiedAPI.relayer}?id=${relayerId}`)
    .then(getPayload)
    .catch(logging)

export const getTokens = async () =>
  HttpClient()
    .get(proxiedAPI.token)
    .then(getPayload)
    .catch(logging)

// EXTERNAL API
export const getTomoPrice = async () =>
  fetch(proxiedAPI.external.tomoprice)
    .then(genericHandler)
    .catch(logging)

export const getAccountTx = async (params) =>
  fetch(proxiedAPI.external.accountTx(params))
    .then(genericHandler)
    .catch(logging)

// STATIC EXTERNAL LINK
export const ExternalLinks = {
  transaction: (tx) => `${ApiFix('https://scan.testnet.tomochain.com/txs')}/${tx}`,
}
