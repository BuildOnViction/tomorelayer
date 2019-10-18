import wretch from 'wretch'
import * as _ from 'service/helper'
import { createTokens } from 'service/backend'

export const UpdateRelayer = async (state, relayer) => {
  const Relayers = Array.from(state.Relayers)
  const index = Relayers.findIndex((r) => r.id === relayer.id)
  Relayers[index] = relayer

  const user = {
    ...state.user,
    relayers: {
      ...state.user.relayers,
      [relayer.coinbase]: relayer,
    },
  }

  const pouch = state.pouch
  await pouch.get('relayer' + relayer.id.toString()).then(doc => pouch.put({
    ...doc,
    ...relayer,
    fuzzy: [
      relayer.name,
      relayer.owner,
      relayer.coinbase,
      relayer.address,
    ].join(','),
  }))

  return {
    user,
    Relayers,
  }
}

export const StoreUnrecognizedTokens = async (state, tokens) => {
  const resp = await createTokens(tokens)
  const Tokens = [ ...state.Tokens, ...resp ]
  return { Tokens }
}

export const GetStats = async (state, { coinbase, tokens }) => {
  const statServiceUrl = pairName => `${process.env.REACT_APP_STAT_SERVICE_URL}/api/trades/stats/${coinbase}/${encodeURI(pairName)}`

  const relayer = state.user.relayers[coinbase]

  let tradeStat = await Promise.all(relayer.from_tokens.map(t => t.toLowerCase()).map(async (fromTokenAddr, idx) => {
    const toTokenAddr = relayer.to_tokens[idx].toLowerCase()
    const pairName = tokens[fromTokenAddr].symbol + '%2F' + tokens[toTokenAddr].symbol
    const [error, data] = await wretch(statServiceUrl(pairName)).get().json().then(resp => [null, resp]).catch(t => [t, null])
    return error || data
  }))

  tradeStat = tradeStat.filter(_.isTruthy).reduce((result, current) => ({
    volume24h: result.volume24h + current.volume24h,
    tradeNumber: result.tradeNumber + current.tradeNumber,
    totalFee: result.totalFee + current.totalFee,
  }))

  const relayerWithStat = {
    ...state.user.relayers[coinbase],
    stat: {
      ...state.user.relayers[coinbase].stat,
      ...tradeStat,
      tomoprice: state.network_info.tomousd,
    }
  }

  return {
    user: {
      ...state.user,
      relayers: {
        ...state.user.relayers,
        [coinbase]: relayerWithStat
      }
    }
  }
}
