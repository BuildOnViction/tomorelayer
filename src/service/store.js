import createStore from '@vutr/redux-zero'
import { UNLOCK_WALLET_METHODS, MISC, socketUrl } from './constant'

const socket = new WebSocket(socketUrl)

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
      fromTokens: [],
      toTokens: [],
      makerFee: 1,
      takerFee: 1,
    },
    tokenForm: false,
  },
  Dashboard: {
    activeTab: 0,
    ConfigureBoard: {
      activeConfig: 0,
    },
  },
  tradableTokens: [],
  MajorTokens: [
    {
      symbol: 'TOMO',
      address: '0x0000000000000000000000000000000000000001',
    },
    {
      symbol: 'USDT',
      address: 'yyyyyy',
    }
  ],
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
    RelayerFormModal: false,
  },
  socket: socket,
  notification: {
    show: false,
    content: '',
  }
}
export const originalState = JSON.parse(JSON.stringify(initialState))
Object.freeze(originalState)

const store = createStore(initialState)

export default store
