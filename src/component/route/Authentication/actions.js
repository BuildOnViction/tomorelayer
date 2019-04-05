import ledger from '@vutr/purser-ledger'
import metamask from '@colony/purser-metamask'
import * as _ from 'service/helper'
import * as blk from 'service/blockchain'
import { SOCKET_REQ, UNLOCK_WALLET_METHODS } from 'service/constant'

const { TomoWallet,LedgerWallet, TrezorWallet, BrowserWallet } = UNLOCK_WALLET_METHODS
const { match } = _

export const $changeMethod = (state, method) => {
  state.authStore.method = method
  return state
}

export const $changeLedgerHdPath = (state, LedgerPath) => {
  state.authStore.user_meta.LedgerPath = LedgerPath
  return state
}

export const $getQRCode = store => state => {
  const isAndroid = window.navigator.userAgent.match(/Android/i)
  const isIOS = window.navigator.userAgent.match(/iPhone|iPad|iPod/i)
  const agentQuery = (isAndroid || isIOS) ? 'mobile' : 'desktop'
  const socket = state.socket

  socket.onopen = () => socket.send(JSON.stringify({
    request: SOCKET_REQ.getQRCode,
    meta: { agentQuery },
  }))

  socket.onmessage = async stringData => {
    const data = JSON.parse(stringData.data)

    if (data.type === 'QR_CODE_REQUEST') {
      const meta = data.meta
      const TomoWalletQRcode = `tomochain:sign?message=${encodeURI(meta.message)}&submitURL=${meta.url}`
      state.authStore.user_meta.TomoWalletQRcode = TomoWalletQRcode
      store.setState(state)
    }

    if (data.type === 'QR_CODE_LOGIN') {
      const meta = data.meta
      const address = meta.address
      const balance = await blk.getBalance(address)
      state.authStore.user_meta.address = address
      state.authStore.user_meta.balance = balance
      state.authStore.user_meta.unlockingMethod = TomoWallet
    }

    store.setState(state)
  }
}

export const $getUnlocked = (state, store) => match({
  [LedgerWallet]: async () => {
    const { authStore } = state
    const customDerivationPath = authStore.user_meta.LedgerPath
    const wallet = await ledger.open({ customDerivationPath })
    const address = wallet.address
    const balance = await blk.getBalance(address)
    state.authStore.user_meta = {
      ...authStore.user_meta,
      unlockingMethod: LedgerWallet,
      wallet,
      address,
      balance,
    }
    state.toggle.AddressModal = true
    return state
  },

  [TrezorWallet]: void 0,

  [BrowserWallet]: async () => {
    const available = await metamask.detect()

    if (!available) {
      alert('No MetaMask Found!')
      return state
    }

    const wallet = await metamask.open()
    let address = wallet.address
    let balance = await blk.getBalance(address)
    state.authStore.user_meta = {
      ...state.authStore.user_meta,
      unlockingMethod: BrowserWallet,
      wallet,
      address,
      balance,
    }

    store.setState(state)

    const walletChangedCallback = async ({ selectedAddress }) => {
      if (address !== selectedAddress) {
        address = selectedAddress;
        balance = await blk.getBalance(address)
        state.authStore.user_meta.address = address
        state.authStore.user_meta.balance = balance
        store.setState(state)
      }
    }

    await metamask.accountChangeHook(walletChangedCallback)
  },
})(state.authStore.method)

export const $metamaskAddressChangeHook = async (state, metamaskWallet) => {
  const currentAddress = state.authStore.user_meta.address
  const address = metamaskWallet.selectedAddress

  if (currentAddress !== '' && currentAddress !== address) {
    const balance = await blk.getBalance(address)
    state.authStore.user_meta.address = address
    state.authStore.user_meta.balance = balance
  }

  return state
}

export const $changeHDWalletAddress = (state, { address, balance }) => {
  state.authStore.user_meta.address = address
  state.authStore.user_meta.balance = balance
  return state
}

export const $confirmAddress = async state => {
  const method = state.authStore.method
  const { address, wallet } = state.authStore.user_meta
  const { LedgerWallet, TrezorWallet } = UNLOCK_WALLET_METHODS
  const usingHardwareWallet = method === LedgerWallet || method === TrezorWallet

  if (usingHardwareWallet) {
    const index = wallet.otherAddresses.indexOf(address)
    await wallet.setDefaultAddress(index)
  }

  state.toggle.AddressModal = false
  state.authStore.auth = true
  return state
}

export const $toggleModal = state => {
  state.toggle.AddressModal = !state.toggle.AddressModal
  return state
}
