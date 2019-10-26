import wretch from 'wretch'
import * as _ from 'service/helper'
import * as d from 'date-fns'
import * as http from 'service/backend'
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

  const summary = {
    volume24h: 0,
    totalFee: 0,
    tradeNumber: 0,
    tomoprice: exchangeRates.TOMO,
  }

  const tokenSymbolCheck = {}
  let tokenData = []

  const defaultForNull = {
    volume24h: 0,
    totalFee: 0,
    tradeNumber: 0
  }

  const request = from_tokens.map(async (addr, idx) => {
    const fromAddress = addr.toLowerCase()
    const toAddress = to_tokens[idx].toLowerCase()
    const fromSymbol = tokenMap[fromAddress].symbol
    const toSymbol = tokenMap[toAddress].symbol
    const pairName = fromSymbol + '/' + toSymbol

    const data = await http.getPairStat(coinbase, pairName)
    const volume24h = (data || defaultForNull).volume24h * exchangeRates[toSymbol]
    const totalFee = (data || defaultForNull).totalFee * exchangeRates[toSymbol]
    const tradeNumber = (data || defaultForNull).tradeNumber

    summary.volume24h += volume24h
    summary.totalFee += totalFee
    summary.tradeNumber += tradeNumber

    if (!(fromSymbol in tokenSymbolCheck)) {
      const meta = {
        address: fromAddress,
        symbol: fromSymbol,
        volume24h,
        tradeNumber,
        percent: 0,
      }

      tokenData = [...tokenData, meta]
      tokenSymbolCheck[fromSymbol] = tokenData.length - 1
    } else {
      const meta = tokenData[tokenSymbolCheck[fromSymbol]]
      meta.volume24h += volume24h
      meta.tradeNumber += tradeNumber
      tokenData[tokenSymbolCheck[fromSymbol]] = meta
    }
  })

  await Promise.all(request)
  tokenData.sort((a, b) => a.volume24h > b.volume24h ? -1 : 1)
  tokenData.forEach(meta => {
    meta.percent = summary.volume24h > 0 ? (meta.volume24h * 100 / summary.volume24h) : 0
  })
  return { summary, tokens: tokenData }
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

  const TokenShares = {
    _24h: [],
    _7d: {},
    _1M: {},
  }

  const seq = _.sequence(0, 30)
  const dates = seq.map(n => d.format(d.subDays(Date.now(), n), "YYYY-MM-DD")).reverse()
  const requests = dates.map(async (date, idx) => {
    const result = await getTradePairStat(from_tokens, to_tokens, tokenMap, exchangeRates, coinbase, { date })
    const value = Object.keys(result).reduce((sum, t) => sum + result[t].volume24h, 0)

    // NOTE: calculating 30 & 7 day token shares
    if (!_.isEmpty(TokenShares._1M)) {

      Object.keys(result).forEach(tk => {
        TokenShares._1M[tk].volume24h += result[tk].volume24h
        if (!_.isEmpty(TokenShares._7d) && idx >= 23) {
          TokenShares._7d[tk].volume24h += result[tk].volume24h
        }
      })

    } else {
      TokenShares._1M = result
    }

    if (_.isEmpty(TokenShares._7d) && idx >= 23) {
      TokenShares._7d = result
    }

    if (idx === 29) {
      // NOTE: calculating the last 24h market data
      const volume24hTotal = Object.values(result).reduce((acc, meta) => meta.volume24h + acc, 0)

      TokenShares._24h = Object.values(result).map(pair => ({
        label: pair.fromSymbol,
        value: volume24hTotal > 0 ? _.round(pair.volume24h * 100 / volume24hTotal, 1) : 0
      })).sort((a, b) => a.value > b.value ? -1 : 1)
    }

    return { label: d.format(date, "MMM DD"), value: _.round(value) }
  })
  const result = await Promise.all(requests)

  // Summarizing weekly & monthly
  const VolumeMonthlyTotal = Object.values(TokenShares._1M).reduce((sum, t) => sum + t.volume24h, 0)
  const VolumeWeeklyTotal = Object.values(TokenShares._7d).reduce((sum, t) => sum + t.volume24h, 0)

  TokenShares._1M = Object.values(TokenShares._1M).map(pair => ({
    label: pair.fromSymbol,
    value: VolumeMonthlyTotal > 0 ? _.round(pair.volume24h * 100 / VolumeMonthlyTotal, 1) : 0,
  })).sort((a, b) => a.value > b.value ? -1 : 1)

  TokenShares._7d = Object.values(TokenShares._7d).map(pair => ({
    label: pair.fromSymbol,
    value: VolumeWeeklyTotal > 0 ? _.round(pair.volume24h * 100 / VolumeWeeklyTotal, 1) : 0,
  })).sort((a, b) => a.value > b.value ? -1 : 1)

  return [result, TokenShares]
}
