import createStore from 'redux-zero'
import { applyMiddleware } from 'redux-zero/middleware'
import { connect } from 'redux-zero/devtools'

export const initialState = {
  user: {
    wallet: undefined,
    expire: 60, // minutes
  },
  Tokens: [],
  Contracts: [],
  Relayers: [],
  Lang: 'en',
  notifications: [],
  shouldUpdateUserRelayers: false,
  activeTheme: 'dark',
  blk: {},
  network_info: {
    tomousd: NaN,
  },
}

const middlewares = connect ? applyMiddleware(connect(initialState)) : []

const store = createStore(initialState, middlewares)

export default store
