import { bindActions } from 'redux-zero/utils'
import store from 'service/store'
import * as http from 'service/backend'
import { AlertVariant } from 'service/frontend'
import { ThrowOn } from 'service/helper'

export const FetchPublic = async (state) => {
  const { Contracts, Relayers, Tokens, error } = await http.getPublicResource()

  const { tomochain, error: tomoPriceError } = await http.getTomoPrice()

  ThrowOn(error, `Fetch Token Error: ${error}`)

  const notifications = [
    ...state.notifications,
    {
      open: true,
      message: 'fetched all resources',
      variant: AlertVariant.success,
    },
  ]

  const network_info = {
    ...state.network_info,
    tomousd: tomoPriceError ? NaN : tomochain.usd,
  }

  return {
    Contracts,
    Relayers,
    Tokens,
    notifications,
    network_info,
  }
}

export const Logout = (state) => {
  window.sessionStorage.removeItem('tomorelayerAccessToken')
  const user = {
    ...state.user,
    wallet: undefined,
  }
  return {
    user,
  }
}

export const bindLogout = () => bindActions({ Logout }, store).Logout()
