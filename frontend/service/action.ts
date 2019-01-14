import wretch from 'wretch'
import { web3 } from '@blockchain'
import { API, ERROR, ALERT } from '@constant'

wretch().defaults({
  headers: {
    'Accept': 'application/json; charset=UTF-8',
  },
})

export const AppInitializer = store => ({
  fetchRegisteredRelayers: () => {
    wretch(API.relayers).get()
      .badRequest(console.error)
      .json(resp => store.setState({ relayers: resp.payload }))
  },
  detectWeb3User: () => {
    web3.eth.getAccounts((err, acc) => {
      if (err) {
        return store.setState({ error: ERROR.web3.getAccounts })
      }

      if (acc.length === 0) {
        return store.setState({ alert: ALERT.web3.not_logged_in })
      }

      if (acc.length > 0) {
        return store.setState({ currentUserAddress: acc[0] })
      }
    })
  },
})
