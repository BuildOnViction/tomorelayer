import ledger from '@vutr/purser-ledger'
import trezor from '@vutr/purser-trezor'
import metamask from '@vutr/purser-metamask'
import * as _ from 'service/helper'
import * as blk from 'service/blockchain'
import { UNLOCK_WALLET_METHODS, STORAGE_ITEMS, TOMO_COIN_TYPE } from 'service/constant'

const { TomoWallet,LedgerWallet, TrezorWallet, BrowserWallet } = UNLOCK_WALLET_METHODS
const { match, assign } = _

export const $changeMethod = (state, method) => assign(state.authStore, { method })

export const $changeLedgerHdPath = (state, LedgerPath) => assign(state.authStore.user_meta, { LedgerPath })

export const $getQRCode = store => state => {
  const isAndroid = window.navigator.userAgent.match(/Android/i)
  const isIOS = window.navigator.userAgent.match(/iPhone|iPad|iPod/i)
  const agentQuery = (isAndroid || isIOS) ? 'mobile' : 'desktop'
  const socket = state.socket

  socket.onmessage = async stringData => {
    const data = JSON.parse(stringData.data)
    const QRCodeLink = meta => `tomochain:sign?message=${encodeURI(meta.message)}&submitURL=${meta.url}`

    if (data.type === 'QR_CODE_REQUEST') assign(state.authStore.user_meta, {
      TomoWalletQRcode: QRCodeLink(data.meta)
    })

    if (data.type === 'QR_CODE_LOGIN') assign(state.authStore.user_meta, {
      address: data.meta.address,
      balance: await blk.getBalance(data.meta.address),
      unlockingMethod: TomoWallet,
    })

    store.setState(state)
  }

  const getQR = () => socket.send(JSON.stringify({
    request: 'QR_CODE_LOGIN',
    meta: { agentQuery },
  }))

  if (socket.readyState === socket.OPEN) {
    getQR()
  } else {
    socket.onopen = getQR
  }

}

export const $getUnlocked = (state, store) => match({
  [LedgerWallet]: async () => {
    const coinType = TOMO_COIN_TYPE
    const wallet = await ledger.open({ coinType })

    assign(state.authStore.user_meta, {
      address: wallet.address,
      balance: await blk.getBalance(wallet.address),
      unlockingMethod: LedgerWallet,
      wallet: wallet,
    })

    state.toggle.AddressModal = true
    return state
  },

  [TrezorWallet]: async () => {
    const wallet = await trezor.open()
    // NOTE: if Trezor accepts TOMO, we can use
    // the custom TOMO_COIN_TYPE to get the correct HDPath
    assign(state.authStore.user_meta, {
      address: wallet.address,
      balance: await blk.getBalance(wallet.address),
      unlockingMethod: TrezorWallet,
      wallet: wallet,
    })

    state.toggle.AddressModal = true
    return state
  },

  [BrowserWallet]: async () => {
    const available = await metamask.detect()

    if (!available) {
      alert('No MetaMask Found!')
      return state
    }

    const wallet = await metamask.open()
    let address = wallet.address
    let balance = await blk.getBalance(address)
    const unlockingMethod = BrowserWallet

    assign(state.authStore.user_meta, {
      address,
      balance,
      unlockingMethod,
      wallet,
    })

    store.setState(state)

    const walletChangedCallback = async ({ selectedAddress }) => {
      if (address !== selectedAddress) {
        address = selectedAddress;
        balance = await blk.getBalance(address)
        assign(state.authStore.user_meta, { address, balance })
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
    assign(state.authStore.user_meta, { address, balance })
  }

  return state
}

export const $changeHDWalletAddress = (state, { address, balance }) => assign(state.authStore.user_meta, { balance, address })

export const $confirmAddress = async state => {
  const method = state.authStore.method
  const { address, wallet } = state.authStore.user_meta
  const usingHardwareWallet = method === LedgerWallet || method === TrezorWallet

  if (usingHardwareWallet) {
    const index = wallet.otherAddresses.indexOf(address)
    await wallet.setDefaultAddress(index)
  }

  state.toggle.AddressModal = false
  state.authStore.auth = true
  state.User.relayers = state.Relayers.filter(r => r.owner === address)

  if (state.User.relayers.length > 0) {
    state.User.activeRelayer = state.User.relayers[0]
  }

  const savingAuthentication = JSON.stringify({ ...state.authStore, lastSession: Date.now() })
  window.localStorage.setItem(STORAGE_ITEMS.authen, savingAuthentication)

  return state
}

export const $toggleModal = state => {
  state.toggle.AddressModal = !state.toggle.AddressModal
  return state
}
