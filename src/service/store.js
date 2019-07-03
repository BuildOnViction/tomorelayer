import createStore from '@vutr/redux-zero'
import { applyMiddleware } from '@vutr/redux-zero/middleware'
import { SOCKET_URI } from 'service/backend'

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

const logger = store => next => action => {
  const state  = store.getState()
  console.log('notifications', state.notifications)
  return next(action)
}

const middleware = applyMiddleware(logger)

const store = createStore(initialState, middleware)

export default store
