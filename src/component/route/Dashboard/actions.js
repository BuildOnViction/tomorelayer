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

  const TokenShares = {
    _24h: [],
    _7d: {},
    _1M: {},
  }

  let Last24hStat = {}

  let TokenTableData = []

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
      TokenTableData = Object.values(result).map(meta => ({
        address: meta.fromAddress,
        symbol: meta.fromSymbol,
        volume: _.round(meta.volume24h, 3),
        trades: meta.tradeNumber,
        price: 0,
      }))

      const volume24hTotal = Object.values(result).reduce((acc, meta) => meta.volume24h + acc, 0)
      const totalFee24hTotal = Object.values(result).reduce((acc, meta) => meta.totalFee + acc, 0)
      const tradeNumber24hTotal = Object.values(result).reduce((acc, meta) => meta.tradeNumber + acc, 0)

      Last24hStat = {
        volume24h: `$ ${_.round(volume24hTotal, 3).toLocaleString({ useGrouping: true })}`,
        // NOTE: if fee too small, format to wei/gwei
        totalFee: `$ ${_.round(totalFee24hTotal, 3).toLocaleString({ useGrouping: true })}`,
        tradeNumber: tradeNumber24hTotal,
        tomoprice: `$ ${_.round(exchangeRates.TOMO, 3)}`,
      }

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

  return [result, TokenShares, Last24hStat, TokenTableData]
}
