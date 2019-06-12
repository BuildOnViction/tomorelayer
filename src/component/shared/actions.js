import { differenceInMinutes } from 'date-fns'
import { Client, Alert as PushAlert, AlertVariant } from 'service/action'
import { originalState } from 'service/store'
import { API, STORAGE_ITEMS } from 'service/constant'

export const $fetchTokens = async state => {
  const resp = await Client.get(API.token)
  state.tradableTokens = resp.payload
  return PushAlert(state, AlertVariant.info, 'Fetched tokens')
}

export const $fetchContract = async (state, store) => {
  const Contracts = await Client.get(API.contract).then(r => r.payload).catch(() => false)

  if (!Contracts) {
    return PushAlert(state, AlertVariant.error, 'Cannot fetch any Contract')
  }

  state.Contracts = Contracts
  return PushAlert(state, AlertVariant.info, 'Fetched contracts')
}

export const $fetchRelayers = async (state, store) => {
  const Relayers = await Client.get(API.relayer).then(r => r.payload).catch(() => false)

  if (!Relayers) return state
  state.Relayers = Relayers

  if (state.authStore.user_meta.address.length > 0) {
    const ownedRelayers = Relayers.filter(r => r.owner === state.authStore.user_meta.address)
    state.User.relayers = ownedRelayers
    state.User.activeRelayer = ownedRelayers[0]
  }

  return PushAlert(state, AlertVariant.info, 'Fetched relayers')
}

export const $changeRelayer = (state, activeRelayer) => {
  state.User.activeRelayer = activeRelayer
  state.Dashboard = { ...originalState.Dashboard }
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

export const $logout = state => {
  window.localStorage.removeItem(STORAGE_ITEMS.authen)
  state.authStore = { ...originalState.authStore }
  state.User = { ...originalState.User }
  state.Dashboard = { ...originalState.Dashboard }
  return state
}
