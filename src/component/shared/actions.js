import { differenceInMinutes } from 'date-fns'
import * as http from 'service/backend'
import { STORAGE_ITEMS } from 'service/constant'
import * as _ from 'service/helper'


export const FetchTokens = async (state) => {
  const Tokens = await http.getTokens()
  _.ThrowOn(Tokens.error, `Fetch Token Error: ${Tokens.error}`)
  return { Tokens }
}


export const FetchContract = async (state) => {
  const Contracts = await http.getContracts()
  _.ThrowOn(Contracts.error, `Fetch Contract Error: ${Contracts.error}`)
  return { Contracts }
}


export const FetchRelayers = async (state, store) => {
  const Relayers = await http.getRelayers()
  _.ThrowOn(Relayers.error, `Fetch Relayer Error: ${Relayers.error}`)
  return { Relayers }
}


export const AutoAuthenticated = state => {
  let user = window.localStorage.getItem(STORAGE_ITEMS.user)

  if (!user) return {}
  user = JSON.parse(user)

  const lastSession = new Date(user.lastSession)
  const now = Date.now()
  const difference = differenceInMinutes(now, lastSession)

  if (difference < state.authStore.expire) {
    return { user }
  }

  window.localStorage.removeItem(STORAGE_ITEMS.user)
  return {}
}
