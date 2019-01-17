import wretch from 'wretch'
import { web3 } from '@blockchain'
import { API, ERROR, ALERT } from '@constant'


wretch().defaults({
  headers: {
    'Accept': 'application/json; charset=UTF-8',
  },
  mode: 'no-cors'
})

export const AsynCatch = promise => promise
  .then(data => [null, data])
  .catch(err => [err])


export const AppInitializer = ({ setState }) => ({

  fetchRegisteredRelayers: () => wretch(API.relayers).get()
    .badRequest(console.error)
    .json(resp => setState({ relayers: resp.payload })),

  detectWeb3User: async () => {
    if (!web3) return setState({ alert: ALERT.web3.meta_mask_unavailable })
    const [err, acc] = await AsynCatch(web3.eth.getAccounts())
    err && !acc && setState({ error: ERROR.web3.getAccounts })
    acc.length === 0 && setState({ alert: ALERT.web3.not_logged_in })
    acc.length > 0 && setState({ currentUserAddress: acc[0] })
  },

})

export const RelayerRegistration = ({ setState }) => ({

  registerRelayer: (state, values) => {
    wretch(API.register).post(values)
      .badRequest(r => console.log(r))
      .json(r => setState({ relayers: [...state.relayers, r] }))
  },

  resetAlert: () => setState({ alert: '' }),

})
