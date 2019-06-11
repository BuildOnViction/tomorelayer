import * as blk from 'service/blockchain'
import { Client } from 'service/action'
import { API } from 'service/constant'


export const $changeTab = (state, activeTab) => {
  state.Dashboard.activeTab = activeTab
  return state
}

export const $changeConfigItem = (state, activeConfig) => {
  state.Dashboard.ConfigureBoard.activeConfig = activeConfig
  return state
}

export const $submitConfigFormPayload = async (state, configs = {}) => {
  const relayer = state.User.activeRelayer

  // Update chain
  const {
    id,
    owner,
    coinbase,
  } = relayer

  const shouldUpdateChain = (
    configs.maker_fee !== relayer.maker_fee ||
    configs.taker_fee !== relayer.taker_fee ||
    configs.from_tokens.length !== relayer.from_tokens.length ||
    configs.to_tokens.length !== relayer.to_tokens.length ||
    !configs.from_tokens.reduce((_, addr, idx) => addr === relayer.from_tokens[idx]) ||
    !configs.to_tokens.reduce((_, addr, idx) => addr === relayer.to_tokens[idx])
  )

  if (shouldUpdateChain) {
    console.warn('Relayer on-chain update', configs)
    const updateChain = await blk.updateRelayer(
      owner,
      coinbase,
      configs.maker_fee,
      configs.taker_fee,
      configs.from_tokens,
      configs.to_tokens,
    )

    if (!updateChain.status) {
      alert('Unable to update relayer data')
      return state
    }
  }

  const relayerPayload = { id, ...configs }
  const updateBackend = await Client.post(API.relayer, { relayer: relayerPayload }).then(resp => resp).catch(() => false)

  if (!updateBackend) {
    alert('Backend update error')
    return state
  }

  const relayerIndex = state.Relayers.findIndex(r => r.id === updateBackend.payload.relayer.id)
  state.Relayers[relayerIndex] = updateBackend.payload.relayer
  state.User.relayers = state.Relayers.filter(r => r.owner === state.authStore.user_meta.address)
  state.User.activeRelayer = updateBackend.payload.relayer

  return state
}
