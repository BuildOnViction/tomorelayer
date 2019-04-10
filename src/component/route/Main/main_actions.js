import * as _ from 'service/helper'
import * as blk from 'service/blockchain'
import { SOCKET_REQ } from 'service/constant'

export const $toggleRelayerFormModal = state => {
  state.toggle.RelayerFormModal = !state.toggle.RelayerFormModal
  return state
}

export const $cancelRegistration = state => {
  state.toggle.RelayerFormModal = false
  state.RelayerForm.relayer_meta = {}
  return state
}
