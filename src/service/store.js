import createStore from '@vutr/redux-zero'
import { applyMiddleware } from '@vutr/redux-zero/middleware'
import { connect } from '@vutr/redux-zero/devtools'
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

const middlewares = connect ? applyMiddleware(connect(initialState)) : []

const store = createStore(initialState, middlewares)

export default store
