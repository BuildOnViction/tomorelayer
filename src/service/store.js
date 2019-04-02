import createStore from 'redux-zero'
import { UNLOCK_WALLET_METHODS } from './constant'

// NOTE: You can split initialState to multiple sub-stores when necessary
const initialState = {
  authStore: {
    auth: false,
    method: UNLOCK_WALLET_METHODS.TomoWallet,
    user_meta: {
      TomoWalletQRcode: '',
      TrezorPath: "m/44'/60'/0'/0",
      LedgerPath: "m/44'/889'/0'/0",
      address: '',
      balance: 0,
      wallet: null,
    },
  },
  global: {
    lang: 'en',
  },
  toggle: {
    AddressModal: false
  },
}

const store = createStore(initialState)

export default store
