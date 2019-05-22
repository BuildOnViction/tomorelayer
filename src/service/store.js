import createStore from 'redux-zero'
import { UNLOCK_WALLET_METHODS, MISC, socketUrl } from './constant'

const socket = new WebSocket(socketUrl)

const initialState = {
  authStore: {
    auth: false,
    method: UNLOCK_WALLET_METHODS.TomoWallet,
    user_meta: {
      TomoWalletQRcode: '',
      TrezorPath: "m/44'/60'/0'/0",
      LedgerPath: "m/44'/889'/0'/0",
      address: '',
      balance: '',
      wallet: null,
      unlockingMethod: UNLOCK_WALLET_METHODS.TomoWallet,
    },
  },
  RelayerForm: {
    step: 1,
    relayer_meta: {
      coinbase: '',
      deposit: MISC.MinimumDeposit,
      name: '',
      fromTokens: [],
      toTokens: [],
      makerFee: 0.1,
      takerFee: 0.1,
    },
  },
  tradableTokens: [],
  Relayers: [],
  global: {
    lang: 'en',
  },
  toggle: {
    AddressModal: false,
    RelayerFormModal: false,
  },
  socket: socket,
  notification: {
    show: false,
    content: '',
  }
}

const store = createStore(initialState)

export default store
