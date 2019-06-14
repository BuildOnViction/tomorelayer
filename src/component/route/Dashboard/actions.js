import * as blk from 'service/blockchain'
import { Client, Alert as PushAlert, AlertVariant } from 'service/action'
import { API } from 'service/constant'


export const $changeTab = (state, activeTab) => {
  state.Dashboard.activeTab = activeTab
  return state
}

export const $submitConfigFormPayload = async (state, configs = {}) => {
  const relayer = state.User.activeRelayer

  const {
    id,
    owner,
    coinbase,
  } = relayer

  const FORM = {
    info: 'info',
    trade: 'trade',
    transfer: 'transfer',
    resign: 'resign',
  }

  const ActiveForm = (cfg => {
    if (cfg.name) return FORM.info
    if (cfg.maker_fee) return FORM.trade
    if (cfg.owner) return FORM.transfer
    if (cfg.coinbase) return FORM.resign
  })(configs)

  // NOTE: nothing to do with FORM.info except saving to DB

  if (ActiveForm === FORM.trade) {
    const shouldUpdateChain = (
      configs.maker_fee !== relayer.maker_fee ||
      configs.taker_fee !== relayer.taker_fee ||
      configs.from_tokens.length !== relayer.from_tokens.length ||
      configs.to_tokens.length !== relayer.to_tokens.length ||
      !configs.from_tokens.reduce((_, addr, idx) => addr === relayer.from_tokens[idx]) ||
      !configs.to_tokens.reduce((_, addr, idx) => addr === relayer.to_tokens[idx])
    )

    if (!shouldUpdateChain) return state

    const updatePayload = { owner, coinbase, ...configs }
    const updateChain = await blk.updateRelayer(updatePayload, state)

    if (!updateChain.status) {
      return PushAlert(state, AlertVariant.error, 'Fail to perform On-Chain Relayer Update')
    }
  }

  if (ActiveForm === FORM.transfer) {
    const transferChain = await blk.transferRelayer(configs, state)
    if (!transferChain.status) {
      return PushAlert(state, AlertVariant.error, 'Fail to perform On-Chain Relayer Transfer')
    }
  }

  if (ActiveForm === FORM.resign) {
    const resignChain = await blk.resignRelayer(configs, state)
    if (!resignChain.status) {
      return PushAlert(state, AlertVariant.error, 'Fail to perform On-Chain Relayer Resignn')
    }
    delete configs['coinbase']
    configs.resigning = true
  }

  const relayerPayload = { id, ...configs }
  const updateBackend = await Client.post(API.relayer, { relayer: relayerPayload }).then(resp => resp).catch(() => false)

  if (!updateBackend) {
    return PushAlert(state, AlertVariant.error, 'Fail to perform Relayer Database Update')
  }

  // NOTE: replacing current relayer data with returned data
  // Filter the current user's relayers from all relayers
  const relayerIndex = state.Relayers.findIndex(r => r.id === updateBackend.payload.relayer.id)
  state.Relayers[relayerIndex] = updateBackend.payload.relayer
  state.User.relayers = state.Relayers.filter(r => r.owner === state.authStore.user_meta.address)
  state.User.activeRelayer = state.User.relayers.find(r => r.id === id) || state.User.relayers[0]

  if (ActiveForm in [FORM.update, FORM.info]) {
    const message = 'Update Successful'
    return PushAlert(state, AlertVariant.success, message)
  }

  if (ActiveForm === FORM.resign) {
    const message = 'Resign request submitted'
    return PushAlert(state, AlertVariant.success, message)
  }

  if (ActiveForm === FORM.transfer) {
    const message = 'Transfer Successful'
    return PushAlert(state, AlertVariant.success, message)
  }

}
