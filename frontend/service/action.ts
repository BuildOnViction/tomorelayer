import { web3 } from '@blockchain'
import { API, ERROR, ALERT } from '@constant'


export const AsynCatch = promise => promise
  .then(data => [null, data])
  .catch(err => [err])

export const Client = {
  get: api => fetch(api).then(r => r.json()),
  post: (api, value) => fetch(api, {
    method: 'POST',
    body: JSON.stringify(value),
    headers: {
      'Accept': 'application/json; charset=UTF-8',
    },
  }).then(r => r.json())
}


export const AppInitializer = ({ setState }) => ({

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
    if (!web3) return setState({ alert: ALERT.web3.meta_mask_unavailable })
    const [err, acc] = await AsynCatch(web3.eth.getAccounts())
    err && !acc && setState({ error: ERROR.web3.getAccounts })
    acc.length === 0 && setState({ alert: ALERT.web3.not_logged_in })
    acc.length > 0 && setState({ currentUserAddress: acc[0] })
  },

})

export const RelayerRegistration = ({ setState }) => ({

  registerRelayer: async (state, values) => {
    const resp = await Client.post(API.register, values)
    if (resp.error) return {
      alert: resp.error.message + ': ' + resp.error.detail,
      error: resp.error,
    }
    return {
      alert: resp.payload,
      relayers: [...state.relayers, resp.payload],
    }
  },

  resetAlert: () => setState({ alert: '', error: '' }),

})
