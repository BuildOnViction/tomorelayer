// import { differenceInMinutes } from 'date-fns'
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
