import * as _ from 'service/helper'
import * as blk from 'service/blockchain'
import { Client } from 'service/action'
import { API, MISC } from 'service/constant'

export const $logout = state => {
  state.authStore.auth = false
  return state
}

export const $backOneStep = state => {
  state.RelayerForm.step = state.RelayerForm.step - 1
  return state
}

export const $submitFormPayload = (state, payload) => {
  _.assign(state.RelayerForm.relayer_meta, payload)
  state.RelayerForm.step = state.RelayerForm.step + 1
  return state
}

export const $cancelRegistration = state => {
  state.toggle.RelayerFormModal = false
  state.RelayerForm.step = 0
  state.RelayerForm.relayer_meta = {
    deposit: MISC.MinimumDeposit,
    name: '',
    fromTokens: [],
    toTokens: [],
    makerFee: 0.1,
    takerFee: 0.1,
  }
  return state
}

export const $fetchTokens = async state => {
  const resp = await Client.get(API.token)
  state.tradableTokens = resp.payload
  return state
}

export const $addToken = async (state, address) => {
  const token = await blk.ERC20TokenInfo(address)
  if (!token) {
    alert(`No such Token at the address: ${address}`)
    return state
  }
  const tokenExist = state.tradableTokens.find(t => t.symbol === token.symbol)

  if (token && !tokenExist) {
    const resp = await Client.post(API.token, { tokens: [token] })
    state.tradableTokens = resp.payload
    return state
  }
}

export const $registerRelayer = async state => {
  const meta = state.RelayerForm.relayer_meta
  const payload = {
    coinbase: meta.coinbase,
    makerFee: meta.makerFee * 10,
    takerFee: meta.takerFee * 10,
    fromTokens: meta.fromTokens.map(p => p.address),
    toTokens: meta.toTokens.map(p => p.address),
  }

  // Transact
  const account = state.authStore.user_meta.address
  const resp = await blk.register(payload, account, meta.deposit)

  if (!resp.status) {
    console.warn(resp)
    alert('Cant save a relayer to Blockchain')
    return state
  }

  // Save Relayer to DB...
  const relayer = {
    owner: state.authStore.user_meta.address,
    name: meta.name,
    coinbase: meta.coinbase,
    maker_fee: meta.makerFee * 10,
    taker_fee: meta.takerFee * 10,
    from_tokens: meta.fromTokens.map(p => p.address),
    to_tokens: meta.toTokens.map(p => p.address),
  }

  const result = await Client.post(API.relayer, { relayer }).then(() => true).catch(() => false)

  if (!result) {
    // NOTE: alert
    return state
  }

  const relayers = await Client.get(API.relayer).then(r => r.payload).catch(() => false)

  if (!relayers) {
    // NOTE: alert
    return state
  }

  state.Relayers = relayers
  state.User.relayers = relayers.filter(r => r.owner === state.authStore.user_meta.address)
  state.RelayerForm.step = state.RelayerForm.step + 1
  return state
}

export const $resetFormState = state => {
  const RelayerForm = {
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
  }

  state.RelayerForm = RelayerForm
  return state
}
