import wretch from 'wretch'
import * as _ from 'service/helper'
import * as d from 'date-fns'
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

export const getTradePairStat = async (
  from_tokens = [],
  to_tokens = [],
  tokenMap = {},
  exchangeRates = {},
  coinbase = '',
  query = {},
) => {

  if (!from_tokens.length) {
    return {}
  }

  const statServiceUrl = pairName => `${process.env.REACT_APP_STAT_SERVICE_URL}/api/trades/stats/${coinbase}/${pairName}`

  const result = { error: [] }

  const request = from_tokens.map(async (addr, idx) => {
    const fromAddress = addr.toLowerCase()
    const toAddress = to_tokens[idx].toLowerCase()
    const fromSymbol = tokenMap[fromAddress].symbol
    const toSymbol = tokenMap[toAddress].symbol

    const pairName = fromSymbol + '%2F' + toSymbol

    const [error, data] = await wretch(statServiceUrl(pairName))
      .query(query).get().json()
      .then(resp => [null, resp])
      .catch(t => [t, null])

    if (!error && !data) {
      result[fromAddress] = {
        fromAddress,
        toAddress,
        fromSymbol,
        toSymbol,
        volume24h: 0,
        totalFee: 0,
        tradeNumber: 0,
      }
      return
    }

    if (error) {
      result.error = [ ...result.error, error ]
    } else {
      result[fromAddress] = {
        fromAddress,
        toAddress,
        fromSymbol,
        toSymbol,
        volume24h: data.volume24h * exchangeRates[toSymbol] + (result[fromAddress] || { volume24h: 0 }).volume24h,
        totalFee: data.totalFee * exchangeRates[toSymbol] + (result[fromAddress] || { totalFee: 0 }).totalFee,
        tradeNumber: data.tradeNumber,
      }
    }
  })

  await Promise.all(request)
  if (!result.error.length) {
    delete result['error']
  }
  return result
}

export const getTradesByCoinbase = async (
  coinbase = '',
  page = 1,
  limit = 10
) => {
  const url = `${process.env.REACT_APP_STAT_SERVICE_URL}/api/trades/listByDex/${coinbase}`
  const [error, response] = await wretch(url).query({ page, limit })
                                             .get().json()
                                             .then(r => [null, r])
                                             .catch(e => [e, null])
  if (error) {
    return null
  }

  return response
}


export const getVolumesOverTime = async (
  from_tokens = [],
  to_tokens = [],
  tokenMap = {},
  exchangeRates = {},
  coinbase,
) => {
  const TokenShares = {}
  const seq = _.sequence(0, 30)
  const dates = seq.map(n => d.format(d.subDays(Date.now(), n), "YYYY-MM-DD")).reverse()
  const requests = dates.map(async (date, idx) => {
    const result = await getTradePairStat(from_tokens, to_tokens, tokenMap, exchangeRates, coinbase, { date })
    const value = Object.keys(result).reduce((sum, t) => sum + result[t].volume24h, 0)
    if (idx === 29) {
      TokenShares._7d = result
    }
    return { label: d.format(date, "MMM DD"), value: _.round(value) }
  })

  const result = await Promise.all(requests)
  return [result, TokenShares]
}
/*
 * export const getTokenShareOverTime = async (
 *   from_tokens = [],
 *   to_tokens = [],
 *   tokenMap = {},
 *   exchangeRates = {},
 *   coinbase,
 * ) => {
 *   const weeklyStat = {}
 *   const monthlyStat = {}
 *   const weeklyUri = ''
 *   const monthlyUri = ''
 * } */
