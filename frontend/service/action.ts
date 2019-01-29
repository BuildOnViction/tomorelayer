import { web3Provider, eth } from '@blockchain'
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

const alerting = error => ({
  alert: [ALERT.error, error.message],
  error: error,
})


// REDUX_ZERO ACTIONS
export const APP_INITIALIZER = ({ setState }) => ({

  fetchRegisteredRelayers: async () => {
    const resp = await Client.get(API.relayers)
    if (resp.error) return alerting(resp.error)
    return {
      relayers: resp.payload,
    }
  },

  detectWeb3User: async () => {
    if (!web3Provider) return { alert: [ALERT.info, 'No MetaMask found!'] }
    return web3Provider.listAccounts().then((acc) => {
      if (acc.length === 0) setState({ alert: [ALERT.warn, 'User not logged in'] })
      if (acc.length) setState({ currentUserAddress: acc[0] })
    })
  },

  fetchContracts: async () => {
    const resp = await Client.get(API.contracts)
    if (resp.error) return alerting(resp.error)
    const contracts = {}
    resp.payload.forEach(contract => {
      contracts[contract.name] = {
        address: contract.address,
        abi: contract.abi,
      }
    })
    return { contracts }
  }

})


export const RELAYER_REGISTRATION = ({ setState }) => ({

  registerRelayer: async (state, values, callback) => {
    const signer = web3Provider.getSigner()
    const { address, abi } = state.contracts.Registration
    const contract = new eth.Contract(address, abi, signer)
    contract.on('NewRelayer', async (author, oldValue, newValue, event) => {
      console.info(`${author} has successfully registered with Blockchain`)
      const args = event.args
      const resp = await Client.post(API.register, {
        name: values.name,
        address: author,
        logo: values.logo,
        dex_rate: values.dex_rate,
        foundation_rate: values.foundation_rate,
      })
      if (!resp.error) {
        const relayers = [...state.relayers, resp.payload]
        console.info(`${author} has successfully registered with Database`)
        setState({
          relayers,
          alert: [ALERT.success, 'You have sucessfully registered!']
        })
      } else {
        setState({ alert: [ALERT.error, 'Cant save Relayer to DB'] })
      }
      return callback(resp)
    })

    const tx = await contract.connect(signer).register(values.dex_rate, values.foundation_rate)
    await tx.wait()
  },

})
