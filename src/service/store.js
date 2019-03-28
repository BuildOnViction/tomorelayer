import createStore from 'redux-zero'
import { UNLOCK_WALLET_METHODS } from './constant'

// NOTE: You can split initialState to multiple sub-stores when necessary
const initialState = {
  authStore: {
    auth: false,
    method: UNLOCK_WALLET_METHODS.TomoWallet,
    ledgerHdPath: "m/44'/889'/0'/0",
    userAddress: '',
  },
  global: {
    lang: 'en'
  }
}

const store = createStore(initialState)

export default store
