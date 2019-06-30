import { differenceInMinutes } from 'date-fns'
import * as http from 'service/backend'
import { STORAGE_ITEMS } from 'service/constant'
import * as _ from 'service/helper'

export const FetchPublic = async (state) => {
  const { Contracts, Relayers, Tokens, error} = await http.getPublicResource()
  _.ThrowOn(error, `Fetch Token Error: ${error}`)
  return { Contracts, Relayers, Tokens }
}

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

export const LogOut = state => {
  window.localStorage.removeItem(STORAGE_ITEMS.user)
  const user = {...state.user}

  for (const key in user) {
    if (key !== 'expire') delete user[key]
  }

  const derived = {...state.derived}

  for (const key in derived) {
    if (key.includes('user')) delete derived[key]
  }

  return { auth: false, user, derived }
}
