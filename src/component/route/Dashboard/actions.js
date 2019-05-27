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
  const relayer = state.User.relayers[state.User.activeRelayer]

  // Update chain
  const {
    id,
    owner,
    coinbase,
    makerFee,
    takerFee,
    fromTokens,
    toTokens,
    name,
    logo,
    link,
  } = relayer

  const shouldUpdateChain = configs.makerFee || configs.takerFee || configs.fromTokens || configs.toTokens

  if (shouldUpdateChain) {
    const updateChain = await blk.updateRelayer(
      owner,
      coinbase,
      configs.makerFee || makerFee,
      configs.takerFee || takerFee,
      configs.fromTokens || fromTokens,
      configs.toTokens || toTokens,
    )

    console.warn(updateChain.details)
    if (!updateChain.status) {
      alert('Unable to update relayer data')
      return state
    }
  }

  const relayerPayload = {
    id,
    name: configs.name || name,
    logo: configs.logo || logo,
    link: configs.link || link,
    makerFee: configs.makerFee || makerFee,
    takerFee: configs.takerFee || takerFee,
    fromTokens: configs.fromTokens || fromTokens,
    toTokens: configs.toTokens || toTokens,
  }

  const updateBackend = await Client.post(API.relayer, { relayer: relayerPayload }).then(resp => resp).catch(() => false)

  if (!updateBackend) {
    alert('Backend update error')
    return state
  }

  console.warn('Update backend', updateBackend)

  state.User.relayers[state.User.activeRelayer] = {
    ...relayer,
    ...updateBackend.payload.relayer,
  }

  return state
}
