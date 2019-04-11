import * as _ from 'service/helper'
import * as blk from 'service/blockchain'
import { SOCKET_REQ, MISC } from 'service/constant'

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
  }
  return state
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
