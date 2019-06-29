import createStore from '@vutr/redux-zero'
import { applyMiddleware } from '@vutr/redux-zero/middleware'
import { SOCKET_URI } from './backend'

const socket = new WebSocket(SOCKET_URI)

export const initialState = {
  auth: false,
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
  // NOTE: a special state where we keep the computed/derived state from other state
  derived: {},
}

const derivationMiddleware = store => next => async action => {
  // NOTE: Here we calculate any derived state if neccessary
  // eg: an owner's related-only data to his related relayers
  const currentState = store.getState()

  const noUserRelayers = !currentState.derived.userRelayers || !Object.keys(currentState.derived.userRelayers).length
  const wallet = currentState.user.wallet
  const relayers = currentState.Relayers

  if (noUserRelayers && wallet && relayers) {
    const userAddress = await wallet.getAddress()
    const userRelayers = {}
    relayers.filter(r => r.owner === userAddress).forEach(r => {
      userRelayers[r.coinbase] = r
    })

    store.setState({
      derived: {
        ...currentState.derived,
        userRelayers,
        userAddress,
      }
    })
  }

  return next(action)
}

const middlewares = applyMiddleware(derivationMiddleware)

const store = createStore(initialState, middlewares)

export default store
