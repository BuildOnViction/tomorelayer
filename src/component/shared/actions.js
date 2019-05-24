import { differenceInMinutes } from 'date-fns'
import { Client } from 'service/action'
import { API, STORAGE_ITEMS } from 'service/constant'


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

export const $autoAuthenticated = state => {
  let authStore = window.localStorage.getItem(STORAGE_ITEMS.authen)
  if (!authStore) return state
  authStore = JSON.parse(authStore)

  const lastSession = new Date(authStore.lastSession)
  const now = Date.now()
  const difference = differenceInMinutes(now, lastSession)

  if (difference < state.authStore.expire) {
    state.authStore = authStore
    return state
  }

  window.localStorage.removeItem(STORAGE_ITEMS.authen)
  return state
}
