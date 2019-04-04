import ledger from '@vutr/purser-ledger'
import metamask from '@colony/purser-metamask'
import { Client } from 'service/action'
import * as _ from 'service/helper'
import * as blk from 'service/blockchain'
import { API, UNLOCK_WALLET_METHODS } from 'service/constant'

const { TomoWallet, LedgerWallet, TrezorWallet, BrowserWallet } = UNLOCK_WALLET_METHODS
const { match } = _

export const $changeMethod = (state, method) => {
  return {
    ...state,
    authStore: {
      ...state.authStore,
      method,
    },
  }
}

export const $changeLedgerHdPath = (state, LedgerPath) => ({
  ...state,
  authStore: {
    ...state.authStore,
    user_meta: {
      ...state.authStore.user_meta,
      LedgerPath,
    }
  }
})

export const $getQRCode = async (state) => {
  const isAndroid = window.navigator.userAgent.match(/Android/i)
  const isIOS = window.navigator.userAgent.match(/iPhone|iPad|iPod/i)
  const agentQuery = (isAndroid || isIOS) ? 'mobile' : 'desktop'
  const data = await Client.get(API.fetchQRCode + agentQuery)
  const TomoWalletQRcode = `tomochain:sign?message=${encodeURI(data.payload.message)}&submitURL=${data.payload.url}`
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
}

export const $getUnlocked = (state, store) => match({
  [TomoWallet]: void 0,

  [LedgerWallet]: async () => {
    const { authStore } = state
    const customDerivationPath = authStore.user_meta.LedgerPath
    const wallet = await ledger.open({ customDerivationPath })
    const address = wallet.address
    const balance = await blk.getBalance(address)
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
      },
      toggle: {
        ...state.toggle,
        AddressModal: true,
      },
    }
    return NewState
  },

  [TrezorWallet]: void 0,

  [BrowserWallet]: async () => {
    const available = await metamask.detect()
    if (available) {
      const wallet = await metamask.open()
      let address = wallet.address
      let balance = await blk.getBalance(address)

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

      store.setState(NewState)

      const walletChangedCallback = async ({ selectedAddress }) => {
        if (address !== selectedAddress) {
          address = selectedAddress;
          balance = await blk.getBalance(address)
          NewState.authStore.user_meta.address = address
          NewState.authStore.user_meta.balance = balance
          store.setState(NewState)
        }
      }

      await metamask.accountChangeHook(walletChangedCallback)
    } else {
      alert('No Metamask Found!')
      return state
    }
  },
})(state.authStore.method)

export const $metamaskAddressChangeHook = async (state, metamaskWallet) => {
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
}

export const $changeHDWalletAddress = (state, { address, balance }) => {
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

export const $confirmAddress = async state => {
  const method = state.authStore.method
  const { address, wallet } = state.authStore.user_meta

  if (method === UNLOCK_WALLET_METHODS.LedgerWallet || method === UNLOCK_WALLET_METHODS.TrezorWallet) {
    const index = wallet.otherAddresses.indexOf(address)
    await wallet.setDefaultAddress(index)
  }

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
}

export const $toggleModal = state => {

  return {
    ...state,
    toggle: {
      ...state.toggle,
      AddressModal: !state.toggle.AddressModal,
    },
  }
}
