import * as _ from 'service/helper'
import * as blk from 'service/blockchain'
import { Client } from 'service/action'
import { API, SOCKET_REQ, MISC } from 'service/constant'

export const $logout = state => {
  state.authStore.auth = false
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
    tradePairs: [],
    makerFee: 0.1,
    takerFee: 0.1,
  }
  return state
}
