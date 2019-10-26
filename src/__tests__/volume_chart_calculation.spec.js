// placeholder
import {
  getTradePairStat,
  // getVolumesOverTime,
} from 'component/route/Dashboard/actions'
import * as http from 'service/backend'

describe('Verifying functions that query from scan api and make market statistic data', () => {

  it('Converting 24h Pairs info to Correct data', async () => {
    // Test tokens
    const AddressTokenA = 'address_token_a'
    const AddressTokenB = 'address_token_b'
    const AddressTokenC = 'address_token_c'
    const AddressTokenD = 'address_token_d'
    const AddressTokenE = 'address_token_e'

    const input = {
      from_tokens: [AddressTokenA, AddressTokenB, AddressTokenC, AddressTokenA, AddressTokenC], //['A', 'B', 'C', 'A', 'C'],
      to_tokens: [AddressTokenC, AddressTokenD, AddressTokenE, AddressTokenE, AddressTokenD], // ['C', 'D', 'E', 'E', 'D'],
      tokenMap: {
        [AddressTokenA]: { symbol: 'A' },
        [AddressTokenB]: { symbol: 'B' },
        [AddressTokenC]: { symbol: 'C' },
        [AddressTokenD]: { symbol: 'D' },
        [AddressTokenE]: { symbol: 'E' },
      },
      exchangeRates: {
        C: 1.5,
        D: 1,
        E: 2,
        TOMO: 1.3,
      },
      coinbase: 'not-needed-because-of-mocking',
    }

    http.getPairStat = jest.fn()
                           .mockResolvedValueOnce({ volume24h: 3, totalFee: 1, tradeNumber: 1 }) // A-C
                           .mockResolvedValueOnce({ volume24h: 1, totalFee: 1, tradeNumber: 2 }) // B-D
                           .mockResolvedValueOnce({ volume24h: 2, totalFee: 2, tradeNumber: 3 }) // C-E
                           .mockResolvedValueOnce({ volume24h: 1, totalFee: 5, tradeNumber: 4 }) // A-E
                           .mockResolvedValueOnce(null) // C-D

    const expectedResult = {
      summary: {
        volume24h: 11.5, // 4.5 + 1 + 4 + 2,
        totalFee: 16.5, // 1.5 + 1 + 4 + 10,
        tradeNumber: 10,
        tomoprice: 1.3,
      },
      tokens: [
        { percent: 650/11.5, address: AddressTokenA, symbol: 'A', tradeNumber: 5, volume24h: 6.5 },
        { percent: 400/11.5, address: AddressTokenC, symbol: 'C', tradeNumber: 3, volume24h: 4 },
        { percent: 100/11.5, address: AddressTokenB, symbol: 'B', tradeNumber: 2, volume24h: 1 },
      ]
    }

    const request = await getTradePairStat(input.from_tokens, input.to_tokens, input.tokenMap, input.exchangeRates, input.coinbase)
    expect(http.getPairStat).toHaveBeenCalledTimes(5)
    expect(request.summary).toEqual(expectedResult.summary)
    expect(request.tokens.length).toEqual(expectedResult.tokens.length)
    expect(request.tokens).toEqual(expectedResult.tokens)
  })
})
