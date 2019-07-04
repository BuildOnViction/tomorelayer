import { bindActions } from 'redux-zero/utils'
import store from 'service/store'
import * as http from 'service/backend'
import { AlertVariant } from 'service/frontend'
import * as _ from 'service/helper'

export const FetchPublic = async (state) => {
  const { Contracts, Relayers, Tokens, error } = await http.getPublicResource()
  _.ThrowOn(error, `Fetch Token Error: ${error}`)
  const notifications = [
    ...state.notifications,
    {
      open: true,
      message: 'fetched all resources',
      variant: AlertVariant.success,
    },
  ]
  return { Contracts, Relayers, Tokens, notifications }
}

export const Logout = (state) => {
  const user = {
    ...state.user,
    wallet: undefined,
  }
  return { user }
}

export const bindLogout = () => bindActions({ Logout }, store).Logout()
