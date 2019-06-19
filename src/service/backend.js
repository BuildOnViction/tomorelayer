// SETUP ENV CONSTANTS

const genericHandler = response => {
  if (response.ok) return response.json()
  throw new Error(response.json())
}

const defaultHeader = {
  Accept: 'application/json; charset=UTF-8',
}

const HttpClient = {
  get: api => fetch(api).then(genericHandler),

  post: (api, value) => fetch(api, {
    method: 'post',
    body: JSON.stringify(value),
    headers: defaultHeader,
  }).then(genericHandler),

  delete: api => fetch(api, {
    method: 'delete',
    headers: defaultHeader,
  }).then(genericHandler),

}

const getPayload = r => r.payload

const logging = error => {
  // TODO: logging, mailing-report on Internal Server Error
  console.error(error)
  return undefined
}

const API = {
  auth: '/api/auth',
  contract: '/api/contract',
  relayer: 'api/relayer',
  token: '/api/token',
}

const proxiedAPI = new Proxy(API, {
  get(property) {
    if (process.env.NODE_ENV === 'test') {
      const pjson = require('./package.json')
      return pjson.proxy + API[property]
    }
    return API[property]
  }
})

/* API ENDPOINTS THAT ACCEPT REQUESTS FROM ORIGIN */
export const getContracts = async () => HttpClient.get(proxiedAPI.contract)
                                                  .then(getPayload)
                                                  .catch(logging)

export const getTokens = async () => HttpClient.get(proxiedAPI.token)
                                               .then(getPayload)
                                               .catch(logging)

export const getRelayers = async () => HttpClient.get(proxiedAPI.relayer)
                                                 .then(getPayload)
                                                 .catch(logging)

export const updateRelayer = async relayer => HttpClient.post(proxiedAPI.relayer, { relayer })
                                                        .then(getPayload)
                                                        .catch(logging)

export const deleteRelayer = async relayerId => HttpClient.delete(`${proxiedAPI.relayer}?id=${relayerId}`)
                                                        .then(getPayload)
                                                        .catch(logging)
