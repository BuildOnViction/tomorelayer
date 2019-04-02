import ledger from '@vutr/purser-ledger'
import metamask from '@colony/purser-metamask'
import { Client } from 'service/action'
import * as _ from 'service/helper'
import * as blk from 'service/blockchain'
import { API, UNLOCK_WALLET_METHODS } from 'service/constant'

const { TomoWallet, LedgerWallet, TrezorWallet, BrowserWallet } = UNLOCK_WALLET_METHODS
const { match } = _

const actions = () => ({

  $changeMethod: (state, method) => {
    return {
      ...state,
      authStore: {
        ...state.authStore,
        method,
      },
    }
  },

  $changeLedgerHdPath: (state, LedgerPath) => ({
    ...state,
    authStore: {
      ...state.authStore,
      user_meta: {
        ...state.authStore.user_meta,
        LedgerPath,
      }
    }
  }),

  $getQRCode: async (state) => {
    const isAndroid = window.navigator.userAgent.match(/Android/i)
    const isIOS = window.navigator.userAgent.match(/iPhone|iPad|iPod/i)
    const agentQuery = (isAndroid || isIOS) ? 'mobile' : 'desktop'
    const data = await Client.get(API.fetchQRCode + agentQuery)
    const TomoWalletQRcode = data.payload.qrcode
    return {
      ...state,
      authStore: {
        ...state.authStore,
        user_meta: {
          ...state.authStore.user_meta,
          TomoWalletQRcode,
        }
      }
    }
  },

  $getUnlocked: state => match({
    [TomoWallet]: void 0,

    [LedgerWallet]: async () => {
      const { authStore } = state
      const customDerivationPath = authStore.user_meta.LedgerPath
      const wallet = await ledger.open({ customDerivationPath })
      const address = wallet.address
      const balance = await blk.getBalance(address)
      const currentAddressIndex = wallet.otherAddresses.indexOf(address)
      await wallet.setDefaultAddress(currentAddressIndex)
      const NewState = {
        ...state,
        authStore: {
          ...authStore,
          user_meta: {
            ...authStore.user_meta,
            wallet,
            address,
            balance,
          }
        }
      }
      return NewState
    },

    [TrezorWallet]: void 0,

    [BrowserWallet]: async () => {
      const available = await metamask.detect()
      if (available) {
        const wallet = await metamask.open()
        const address = wallet.address
        const balance = await blk.getBalance(address)
        const NewState = {
          ...state,
          authStore: {
            ...state.authStore,
            user_meta: {
              ...state.authStore.user_meta,
              wallet,
              address,
              balance,
            }
          }
        }
        return NewState
      } else {
        alert('No Metamask Found!')
        return state
      }
    },
  })(state.authStore.method),

  $metamaskAddressChangeHook: async (state, metamaskWallet) => {
    const currentAddress = state.authStore.user_meta.address
    const address = metamaskWallet.selectedAddress
    if (currentAddress !== '' && currentAddress !== address) {
      const balance = await blk.getBalance(address)
      return {
        ...state,
        authStore: {
          ...state.authStore,
          user_meta: {
            ...state.authStore.user_meta,
            address,
            balance,
          },
        },
      }
    }
    return state
  },

  $changeHDWalletAddress: (state, { address, balance }) => {
    return {
      ...state,
      authStore: {
        ...state.authStore,
        user_meta: {
          ...state.authStore.user_meta,
          address,
          balance,
        },
      },
    }
  },

  $confirmAddress: state => {
    return {
      ...state,
      authStore: {
        ...state.authStore,
        auth: true,
      },
      toggle: {
        ...state.toggle,
        AddressModal: false,
      },
    }
  },

  $toggleModal: state => {

    return {
      ...state,
      toggle: {
        ...state.toggle,
        AddressModal: !state.toggle.AddressModal,
      },
    }
  },
})

export default actions
