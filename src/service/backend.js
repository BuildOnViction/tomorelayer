import qs from 'qs'
import urljoin from 'url-join'

export const BACKEND_URI = ((env) => {
  switch (env) {
    case 'test':
      return 'http://localhost:8889'
    case 'production':
      return window.location.origin
    default:
      return 'http://localhost:8888'
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

const HttpClient = (extraConfig = {}) => {
  const headers = {
    ...defaultHeader,
    ...extraConfig,
    Authorization: `Bearer ${window.sessionStorage.getItem('tomorelayerAccessToken')}`,
  }

  return {
    get: async (api) =>
      fetch(api, {
        method: 'GET',
        headers,
      }).then(genericHandler),

    put: async (api) =>
      fetch(api, {
        method: 'PUT',
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
  if (r.payload && r.payload.token) {
    window.sessionStorage.setItem('tomorelayerAccessToken', r.payload.token)
  }
  return r.payload || r
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

const API = {
  auth: '/api/auth',
  contract: '/api/contract',
  relayer: '/api/relayer',
  token: '/api/token',
  mailer: '/api/mailer',
  public: '/api/public',
  external: {
    tomoprice: `${process.env.REACT_APP_STAT_SERVICE_URL}/api/setting/usd`,
    accountTx: (params) => {
      const { ownerAddress, contractAddress, limit, page, type } = params
      const paramsEncoded = qs.stringify({
        tx_type: type,
        filterAddress: contractAddress,
        page,
        limit,
      })
      const baseEndpoint = `${process.env.REACT_APP_STAT_SERVICE_URL}/api/txs/listByAccount`
      return `${baseEndpoint}/${ownerAddress}?${paramsEncoded}`
    },
    getTokenInfo: (tokenAddress) => {
      const baseEndpoint = `${process.env.REACT_APP_STAT_SERVICE_URL}/api/tokens`
      return `${baseEndpoint}/${tokenAddress}`
    },
    getPairStat: (coinbase, pair, query = {}) => {
      const fixedPairName = pair.replace('/', '%2F')
      const url = `${process.env.REACT_APP_STAT_SERVICE_URL}/api/trades/stats/${coinbase}/${fixedPairName}`
      const params = qs.stringify(query)
      return `${url}?${params}`
    }
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
export const getAuthenticated = async (address, signature) =>
  HttpClient()
    .get(`${proxiedAPI.auth}?address=${address}&signature=${signature}`)
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

export const createContracts = async (contracts) =>
  HttpClient()
    .post(proxiedAPI.contract, contracts)
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

export const createTokens = async (payload) =>
  HttpClient()
    .post(proxiedAPI.token, payload)
    .then(getPayload)
    .catch(logging)

export const sendFeedback = async feedback =>
  HttpClient()
    .post(proxiedAPI.mailer, { feedback })
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

export const getPairStat = async (coinbase, pairs, query = {}) =>
  fetch(proxiedAPI.external.getPairStat(coinbase, pairs, query))
    .then(genericHandler)
    .catch(logging)

export const getTokenInfo = async (tokenAddress) =>
  fetch(proxiedAPI.external.getTokenInfo(tokenAddress))
    .then(genericHandler)
    .catch(logging)

export const notifyDex = async (dexUrl) =>
  HttpClient()
    .put(urljoin(dexUrl, `/api/relayer`))
    .then(resp => {
      try {
        return resp
      } catch(e) {
        throw resp
      }
    })
    .catch(error => ({ error }))

// STATIC EXTERNAL LINK
export const ExternalLinks = {
  transaction: (tx) => `${process.env.REACT_APP_STAT_SERVICE_URL}/txs/${tx}`,
  token: (token) => `${process.env.REACT_APP_STAT_SERVICE_URL}/tokens/${token}`,
  trades: tradeHash => `${process.env.REACT_APP_STAT_SERVICE_URL}/trades/${tradeHash}`,
}
