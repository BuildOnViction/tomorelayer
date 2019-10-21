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
  const statServiceUrl = pairName => `${process.env.REACT_APP_STAT_SERVICE_URL}/api/trades/stats/${coinbase}/${pairName}`

  const relayer = state.user.relayers[coinbase]

  const tradeStat = await Promise.all(relayer.from_tokens.map(t => t.toLowerCase()).map(async (fromTokenAddr, idx) => {
    const toTokenAddr = relayer.to_tokens[idx].toLowerCase()
    const pairName = tokens[fromTokenAddr].symbol + '%2F' + tokens[toTokenAddr].symbol
    const [error, data] = await wretch(statServiceUrl(pairName)).get().json().then(resp => [null, resp]).catch(t => [t, null])
    return error || { ...data, from: tokens[fromTokenAddr].symbol, to: tokens[toTokenAddr].symbol }
  }))

  // NOTE: summary of today's statistic
  const todayTotal = tradeStat.filter(_.isTruthy).reduce((result, current) => ({
    volume24h: result.volume24h + current.volume24h,
    tradeNumber: result.tradeNumber + current.tradeNumber,
    totalFee: result.totalFee + current.totalFee,
  }))

  // NOTE: Token market share over 24h
  let tokenShares_24h = {}
  const totalVolume24h = todayTotal.volume24h
  tradeStat.filter(_.isTruthy).forEach(t => {
    if (!(t.from in tokenShares_24h)) {
      tokenShares_24h[t.from] = t.volume24h/totalVolume24h * 100
    } else {
      tokenShares_24h[t.from] = t.volume24h/totalVolume24h * 100 + tokenShares_24h[t.from]
    }
  })

  tokenShares_24h = Object.keys(tokenShares_24h).map(k => ({
    label: k,
    value: _.round(tokenShares_24h[k], 0)
  })).sort((a, b) => parseInt(a.value, 10) < parseInt(b.value, 10) ? 1 : -1)

  const relayerWithStat = {
    ...state.user.relayers[coinbase],
    tokenMap: tokens,
    stat: {
      ...state.user.relayers[coinbase].stat,
      ...todayTotal,
      tokenShares: {
        _24h: tokenShares_24h
      },
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
