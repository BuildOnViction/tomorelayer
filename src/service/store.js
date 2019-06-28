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

  if (
    currentState.user.wallet &&
    currentState.Relayers &&
    !currentState.derived.userRelayers
  ) {
    const Relayers = currentState.Relayers
    const userWallet = currentState.user.wallet
    const userAddress = await userWallet.getAddress()
    const userRelayers = Relayers.filter(r => r.owner === userAddress)

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
