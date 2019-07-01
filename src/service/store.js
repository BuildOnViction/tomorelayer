import createStore from '@vutr/redux-zero'
import { SOCKET_URI } from './backend'

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
}

const store = createStore(initialState)

export default store
