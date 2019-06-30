import createStore from '@vutr/redux-zero'
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
}

const store = createStore(initialState)

export default store
