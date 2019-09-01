import { getDexTrades } from 'service/backend'

export const UpdateRelayer = (state, relayer) => {
  const Relayers = Array.from(state.Relayers)
  const index = Relayers.findIndex((r) => r.id === relayer.id)
  Relayers[index] = relayer

  return {
    Relayers,
  }
}

export const GetStats = async (state, url) => {
  const orders = await getDexTrades(url, {
    sortType: 'dec',
  })
  console.log(orders)

  return {}
}
