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

  const shouldUpdateChain = configs.makerFee || configs.takerFee || configs.fromTokens || configs.toTokens

  if (shouldUpdateChain) {
    const updateChain = await blk.updateRelayer(
      owner,
      coinbase,
      configs.makerFee,
      configs.takerFee,
      configs.fromTokens,
      configs.toTokens,
    )

    console.warn(updateChain.details)
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
