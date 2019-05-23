import { Client } from 'service/action'
import { API } from 'service/constant'


export const $fetchRelayers = async (state) => {
  const Relayers = await Client.get(API.relayer).then(r => r.payload).catch(() => false)

  if (!Relayers) return state
  state.Relayers = Relayers

  if (state.authStore.user_meta.address.length > 0) {
    state.User.relayers = Relayers.filter(r => r.owner === state.authStore.user_meta.address)
  }

  return state
}

export const $changeActiveRelayer = (state, activeRelayer) => {
  state.User.activeRelayer = activeRelayer
  return state
}
