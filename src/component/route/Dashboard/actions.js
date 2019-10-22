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
  const exchangeRatesToUSD = {
    TOMO: state.network_info.tomousd,
    BTC: state.network_info.btcusd,
  }

  const statServiceUrl = pairName => `${process.env.REACT_APP_STAT_SERVICE_URL}/api/trades/stats/${coinbase}/${pairName}`

  const relayer = state.user.relayers[coinbase]

  const tradeStat = await Promise.all(relayer.from_tokens.map(t => t.toLowerCase()).map(async (fromTokenAddr, idx) => {
    const toTokenAddr = relayer.to_tokens[idx].toLowerCase()
    const pairName = tokens[fromTokenAddr].symbol + '%2F' + tokens[toTokenAddr].symbol
    const [error, data] = await wretch(statServiceUrl(pairName)).get().json().then(resp => [null, resp]).catch(t => [t, null])
    return error || {
      fromAddr: fromTokenAddr,
      fromSymbol: tokens[fromTokenAddr].symbol,
      toAddr: toTokenAddr,
      toSymbol: tokens[toTokenAddr].symbol,
      volume24h: data.volume24h * exchangeRatesToUSD[tokens[toTokenAddr].symbol],
      totalFee: data.totalFee * exchangeRatesToUSD[tokens[toTokenAddr].symbol],
      tradeNumber: data.tradeNumber,
    }
  }))

  // NOTE: summary of today's statistic
  const todayTotal = tradeStat.filter(_.isTruthy).reduce((result, current) => ({
    volume24h: result.volume24h + current.volume24h,
    tradeNumber: result.tradeNumber + current.tradeNumber,
    totalFee: result.totalFee + current.totalFee,
  }))

  // NOTE: Token market share over 24h
  const tokenStat24h = {}
  const totalVolume24h = todayTotal.volume24h
  tradeStat.filter(_.isTruthy).forEach(t => {
    if (!(t.fromSymbol in tokenStat24h)) {
      tokenStat24h[t.fromSymbol] = {
        volume: t.volume24h,
        trades: t.tradeNumber,
        fee: t.totalFee,
        address: t.fromAddr,
      }
    } else {
      tokenStat24h[t.fromSymbol] = {
        volume: t.volume24h + tokenStat24h[t.fromSymbol].volume,
        trades: t.tradeNumber + tokenStat24h[t.fromSymbol].trades,
        fee: t.totalFee + tokenStat24h[t.fromSymbol].fee,
        address: t.fromAddr,
      }
    }
  })

  const chartTokenShares24h = Object.keys(tokenStat24h).map(symbol => ({
    label: symbol,
    value: _.round(tokenStat24h[symbol].volume / totalVolume24h * 100, 0)
  })).sort((a, b) => a.value < b.value ? 1 : -1)

  // NOTE: tokenTableData
  const tokenTableData = Object.keys(tokenStat24h).map(symbol => ({
    address: tokenStat24h[symbol].address,
    symbol: symbol,
    price: 0,
    trades: tokenStat24h[symbol].trades,
    volume: _.round(tokenStat24h[symbol].volume, 3),
  })).sort((a, b) => a.volume > b.volume ? -1 : 1)

  // NOTE: save all the stats
  const relayerWithStat = {
    ...state.user.relayers[coinbase],
    tokenMap: tokens,
    stat: {
      ...state.user.relayers[coinbase].stat,
      ...todayTotal,
      tokenTableData,
      tokenShares: {
        _24h: chartTokenShares24h,
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

export const getTradePairStat = async (
  from_tokens = [],
  to_tokens = [],
  tokenMap = {},
  exchangeRates = {},
  coinbase = ''
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
      .get().json()
      .then(resp => [null, resp])
      .catch(t => [t, null])

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


export const getOrdersByCoinbase = async (
  coinbase = '',
  page = 1,
  limit = 10
) => {
  const url = `https://scan.devnet.tomochain.com/api/trades/listByDex/${coinbase}`
  const [error, response] = await wretch(url).query({ page, limit })
                                    .get().json()
                                    .then(r => [null, r])
                                    .catch(e => [e, null])
  if (error) {
    return null
  }

  return response
}
