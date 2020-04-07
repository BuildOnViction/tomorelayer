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
  // NOTE: non-reducer action
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
    meta.percent = summary.volume24h > 0 ? _.round(meta.volume24h * 100 / summary.volume24h, 1) : 0
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

  const fromTokensLoweredCase = from_tokens.map(t => t.toLowerCase())
  const toTokensLoweredCase = to_tokens.map(t => t.toLowerCase())

  const uniqueTokensLength = _.unique(from_tokens).length

  const TokenStat = {
    _7d: new Array(uniqueTokensLength),
    _1M: new Array(uniqueTokensLength),
  }

  const VolumeStat = {
    _7d: new Array(7),
    _1M: new Array(30),
  }

  let MonthlyTotalVolume = 0
  let WeeklyTotalVolume = 0

  const defaultForNull = {
    volume24h: 0,
    totalFee: 0,
    tradeNumber: 0
  }

  const MonthlyVolumeByToken = {}
  const WeeklyVolumeByToken = {}

  const dateSeq = new Array(30).fill(undefined)

  const result = await Promise.all(dateSeq.map(async (_, dateIndex) => {
    const reverseIdx = 0 - dateIndex
    const date = d.format(d.addDays(Date.now(), reverseIdx), "YYYY-MM-DD")
    const dateOnChart = d.format(d.addDays(Date.now(), reverseIdx), "MMM DD")
    let volumeByDate = 0

    const requests = fromTokensLoweredCase.map(async (tk, idx) => {
      const toToken = toTokensLoweredCase[idx]
      const fromTokenSymbol = tokenMap[tk].symbol
      const toTokenSymbol = tokenMap[toToken].symbol
      const pair = fromTokenSymbol + '/' + toTokenSymbol
      const stat = await http.getPairStat(coinbase, pair, { date })

      const defaultValue = stat || defaultForNull
      const resolved = {
        date: dateOnChart,
        tradeNumber: defaultValue.tradeNumber,
        from: fromTokenSymbol,
        to: toTokenSymbol,
        volume24h: defaultValue.volume24h * exchangeRates[toTokenSymbol],
        totalFee: defaultValue.totalFee * exchangeRates[toTokenSymbol],
      }

      volumeByDate += resolved.volume24h

      if (!(fromTokenSymbol in MonthlyVolumeByToken)) {
        MonthlyVolumeByToken[fromTokenSymbol] = 0
      }

      if (!(fromTokenSymbol in WeeklyVolumeByToken)) {
        WeeklyVolumeByToken[fromTokenSymbol] = 0
      }

      MonthlyTotalVolume += volumeByDate
      MonthlyVolumeByToken[fromTokenSymbol] += volumeByDate

      if (reverseIdx >= -6) {
        WeeklyTotalVolume += volumeByDate
        WeeklyVolumeByToken[fromTokenSymbol] += volumeByDate
      }
    })

    await Promise.all(requests)
    const dailyVolumeStat = { date: dateOnChart, volume: volumeByDate }
    VolumeStat._1M[29 - dateIndex] = dailyVolumeStat
    if (reverseIdx >= -6) {
      VolumeStat._7d[6 - dateIndex] = dailyVolumeStat
    }
  }))

  await Promise.all(result)
  TokenStat._7d = Object.keys(WeeklyVolumeByToken).map(symbol => ({
    symbol,
    percent: WeeklyTotalVolume > 0 ? _.round(WeeklyVolumeByToken[symbol] * 100 / WeeklyTotalVolume, 1) : 0
  })).sort((a, b) => a.percent > b.percent ? -1 : 1)

  TokenStat._1M = Object.keys(MonthlyVolumeByToken).map(symbol => ({
    symbol,
    percent: MonthlyTotalVolume > 0 ? _.round(MonthlyVolumeByToken[symbol] * 100 / WeeklyTotalVolume, 1) : 0
  })).sort((a, b) => a.percent > b.percent ? -1 : 1)

  return {VolumeStat, TokenStat}
}
