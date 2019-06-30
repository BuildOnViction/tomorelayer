// import { differenceInMinutes } from 'date-fns'
import * as http from 'service/backend'
// import { STORAGE_ITEMS } from 'service/constant'
import * as _ from 'service/helper'

export const FetchPublic = async (state) => {
  const { Contracts, Relayers, Tokens, error} = await http.getPublicResource()
  _.ThrowOn(error, `Fetch Token Error: ${error}`)
  return { Contracts, Relayers, Tokens }
}
