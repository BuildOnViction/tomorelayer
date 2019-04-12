import * as _ from 'service/helper'
import * as blk from 'service/blockchain'
import { Client } from 'service/action'
import { API, SOCKET_REQ, MISC } from 'service/constant'

export const $toggleRelayerFormModal = state => {
  state.toggle.RelayerFormModal = !state.toggle.RelayerFormModal
  return state
}

export const $cancelRegistration = state => {
  state.toggle.RelayerFormModal = false
  state.RelayerForm.step = 0
  state.RelayerForm.relayer_meta = {
    deposit: MISC.MinimumDeposit,
    name: '',
    tradePairs: [],
    makerFee: 0.1,
    takerFee: 0.1,
  }
  return state
}

export const $fetchTokens = async (state) => {
  const response = await Client.get(API.token)
  console.log(response)
  if (response.ok) {
    state.tradableTokens = response.payload
  } else {
    state.notification = {
      show: true,
      content: 'Error fetching Tokens from server!',
    }
  }
  return state
}

export const $addNewToken = async (state, tokens) => {
  const backendUpdate = await Client.post(API.tokens, tokens)
}

export const $submitFormPayload = (state, payload) => {
  _.assign(state.RelayerForm.relayer_meta, payload)
  state.RelayerForm.step = state.RelayerForm.step + 1
  return state
}

export const $changeStep = (state, step) => {
  state.RelayerForm.step = step
  return state
}

export const $finalizeRegistration = state => {
  console.info('Finalization', state.RelayerForm.relayer_meta)
  return state
}
