import * as _ from 'service/helper'
import * as blk from 'service/blockchain'
import { Client, Alert as PushAlert, AlertVariant } from 'service/action'
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
  state.RelayerForm.step = 1
  state.RelayerForm.relayer_meta = {
    deposit: MISC.MinimumDeposit,
    name: '',
    from_tokens: [],
    to_tokens: [],
    maker_fee: 0.1,
    taker_fee: 0.1,
  }
  return state
}

export const $toggleCustomTokenForm = state => {
  state.RelayerForm.tokenForm = !state.RelayerForm.tokenForm
  return state
}

export const $addToken = async (state, token) => {
  const resp = await Client.post(API.token, { tokens: [token] })
  state.tradableTokens = resp.payload
  state.RelayerForm.tokenForm = false
  return state
}

export const $registerRelayer = async state => {
  const meta = state.RelayerForm.relayer_meta

  const payload = {
    coinbase: meta.coinbase,
    maker_fee: meta.maker_fee,
    taker_fee: meta.taker_fee,
    from_tokens: meta.from_tokens.map(p => p.address),
    to_tokens: meta.to_tokens.map(p => p.address),
  }

  // Transact
  const resp = await blk.register(payload, state)

  if (!resp.status) {
    return PushAlert(state, AlertVariant.error, 'Cannot register new relayer to the TomoChain')
  }

  // Save Relayer to DB...
  const relayer = {
    owner: state.authStore.user_meta.address,
    name: meta.name,
    coinbase: meta.coinbase,
    maker_fee: meta.maker_fee,
    taker_fee: meta.taker_fee,
    from_tokens: meta.from_tokens.map(p => p.address),
    to_tokens: meta.to_tokens.map(p => p.address),
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
      from_tokens: [],
      to_tokens: [],
      maker_fee: 0.1,
      taker_fee: 0.1,
    },
  }

  state.RelayerForm = RelayerForm
  return state
}
