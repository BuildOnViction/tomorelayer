import * as _ from 'service/helper'
import * as blk from 'service/blockchain'
import { Client } from 'service/action'
import { API, SOCKET_REQ, MISC } from 'service/constant'


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

  if (state.RelayerForm.step === 5) {
    console.log(state.RelayerForm.relayer_meta);
  }

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
    name: meta.name,
    makerFee: meta.makerFee * 1000,
    takerFee: meta.takerFee * 1000,
    fromTokens: meta.fromTokens.map(p => p.address),
    toTokens: meta.toTokens.map(p => p.address),
  }
  // Get contract from Backend
}
