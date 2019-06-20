import { differenceInMinutes } from 'date-fns'
import { PushAlert, AlertVariant } from 'service/frontend'
import * as http from 'service/backend'
import { originalState } from 'service/store'
import { STORAGE_ITEMS } from 'service/constant'
import * as _ from 'service/helper'

export const $fetchTokens = async state => {
  const resp = await http.getTokens()
  state.tradableTokens = resp
  state.MajorTokens = resp.filter(t => t.is_major)
  return PushAlert(state, AlertVariant.info, 'Fetched tokens')
}

export const $fetchContract = async (state, store) => {
  const Contracts = await http.getContracts()

  if (Contracts.error) {
    return PushAlert(state, AlertVariant.error, 'Cannot fetch any Contract')
  }

  state.Contracts = Contracts
  return PushAlert(state, AlertVariant.info, 'Fetched contracts')
}

export const $fetchRelayers = async (state, store) => {
  const Relayers = await http.getRelayers()

  if (Relayers.error) return state
  state.Relayers = Relayers

  if (state.authStore.user_meta.address.length > 0) {
    const ownedRelayers = Relayers.filter(r => _.compareString(r.owner, state.authStore.user_meta.address))
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
