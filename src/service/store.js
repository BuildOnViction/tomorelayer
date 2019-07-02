import createStore from '@vutr/redux-zero'
import { applyMiddleware } from '@vutr/redux-zero/middleware'
import { SOCKET_URI } from 'service/backend'
import RelayerContract from 'service/relayer_contract'

const socket = new WebSocket(SOCKET_URI)

export const initialState = {
  user: {
    wallet: undefined,
    expire: 60, // minutes
  },
  Tokens: [],
  Contracts: [],
  Relayers: [],
  Lang: 'en',
  socket: socket,
  notifications: [],
  shouldUpdateUserRelayers: false,
  blk: {},
}

const contractInitialization = store => next => action => {
  const state = store.getState()
  const contractMeta = state.Contracts.find(r => r.name === 'RelayerRegistration' && !r.obsolete)
  const walletSigner = state.user.wallet

  const isContractNotInitiaized = !state.blk.RelayerContract && contractMeta && walletSigner
  const userJustChangeWallet = state.blk.RelayerContract && walletSigner && state.blk.RelayerContract.wallet !== walletSigner

  if (isContractNotInitiaized || userJustChangeWallet) {
    const blk = {
      RelayerContract: new RelayerContract(walletSigner, contractMeta)
    }
    store.setState({ blk })
  }

  return next(action)
}

const middlewares = applyMiddleware(contractInitialization)

const store = createStore(initialState, middlewares)

export default store
