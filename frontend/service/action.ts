import wretch from 'wretch'
import { web3 } from '@blockchain'
import { API } from '@constant'

wretch().defaults({
  headers: {
    'Accept': 'application/json; charset=UTF-8',
  }
})

export const AppInitializer = store => ({
  fetchRegisteredRelayers: () => {
    wretch(API.relayers).get()
      .badRequest(console.error)
      .json(resp => store.setState({ relayers: resp.payload }))
  },
  detectWeb3User: () => {
    web3.eth.getAccounts((err, acc) => {
      console.log(err)
      console.log(acc)
    })
  }
})
