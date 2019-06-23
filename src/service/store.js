import createStore from '@vutr/redux-zero'
import { UNLOCK_WALLET_METHODS, MISC } from './constant'
import { SOCKET_URI } from './backend'

const socket = new WebSocket(SOCKET_URI)

export const initialState = {
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
    expire: 60 // minutes
  },
  RelayerForm: {
    step: 1,
    relayer_meta: {
      coinbase: '',
      deposit: MISC.MinimumDeposit,
      name: '',
      from_tokens: [],
      to_tokens: [],
      maker_fee: 1,
      taker_fee: 1,
    },
    tokenForm: false,
  },
  tradableTokens: [],
  MajorTokens: [],
  Contracts: [],
  Relayers: [],
  User: {
    relayers: [],
    activeRelayer: undefined,
  },
  global: {
    lang: 'en',
  },
  toggle: {
    AddressModal: false,
  },
  socket: socket,
  notifications: [],
}

const store = createStore(initialState)

export default store
