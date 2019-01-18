import { web3 } from '@blockchain'
import { API, ERROR, ALERT } from '@constant'

// ASYNC REQUEST CONFIGS
export const AsynCatch = promise => promise
  .then(data => [null, data])
  .catch(err => [err])

export const Client = {
  get: api => fetch(api).then(r => r.json()),
  post: (api, value) => fetch(api, {
    method: 'POST',
    body: JSON.stringify(value),
    headers: {
      Accept: 'application/json; charset=UTF-8',
    },
  }).then(r => r.json()),
}

// REDUX_ZERO ACTIONS
export const APP_INITIALIZER = ({ setState }) => ({

  fetchRegisteredRelayers: async () => {
    const resp = await Client.get(API.relayers)
    if (resp.error) return {
      alert: resp.error.message,
      error: resp.error,
    }
    return {
      relayers: resp.payload,
    }
  },

  detectWeb3User: async () => {
    if (!web3 || !web3.eth) return { alert: ALERT.web3.meta_mask_unavailable }
    return web3.eth.getAccounts((err, acc) => {
      if (err && !acc) setState({ error: ERROR.web3.getAccounts })
      if (acc.length === 0) setState({ alert: ALERT.web3.not_logged_in })
      if (acc.length) setState({ currentUserAddress: acc[0] })
    })
  },

})

export const RELAYER_REGISTRATION = ({ setState }) => ({

  registerRelayer: async (state, values, callback) => {
    const resp = await Client.post(API.register, values)
    if (!resp.error) {
      const relayers = [...state.relayers, resp.payload]
      setState({ relayers })
    }
    return callback(resp)
  },

})
