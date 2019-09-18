import createStore from 'redux-zero'
import { applyMiddleware } from 'redux-zero/middleware'
import { connect } from 'redux-zero/devtools'
import { isTruthy } from './helper'

export const initialState = {
  user: {
    wallet: undefined,
    expire: 60, // minutes
    relayers: {},
    stats: {},
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
  pouch: undefined,
}

const middlewares = applyMiddleware(...[connect && connect(initialState)].filter(isTruthy))

const store = createStore(initialState, middlewares)

export default store
