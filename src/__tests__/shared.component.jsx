import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
} from '@testing-library/react'
import 'jest-dom/extend-expect'
import {
  TokenPairList,
  FilterControl,
  mapProps as MapStateToProps,
  makeCheckList as MakeCheckList,
} from 'component/shared/TokenPairList'

const fs = require('fs')
const path = require('path')

const rawtokens = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/_token.dummy.json')))

/**
 * Testing Shared Components
 * @test {Shared}
 * - Here we test all shared components that are used accross different parts of the App
 * - all blockchain functions will be mocked
 * - yet, backend functions will all be tested through as well
 */


const quoteTokens = ['TOMO', 'ETH', 'BTC']
const Tokens = rawtokens.map((t, idx) => {
  if (quoteTokens.includes(t.symbol)) {
    t['is_major'] = true
  }
  t.id = idx
  return t
})

const { pairs, pairMapping } = MapStateToProps({ tradableTokens: Tokens })


describe('Stateless Pair-Builder Function', () => {

  it('#1. QuoteToken<->QuoteToken pairs should be listed first - Order: Tomo > Btc > Eth  ', () => {

    const quoteTokensAtListHead = [
      'TOMO/BTC',
      'TOMO/ETH',
      'BTC/ETH',
      'BTC/TOMO',
      'ETH/BTC',
      'ETH/TOMO',
    ]

    const pairToListStr = pairs.map(t => t.toString())
    quoteTokensAtListHead.forEach((t, idx) => {
      expect(t).toEqual(pairToListStr[idx])
    })
  })

  it('#2. Quote->Base is not a valid pair', () => {
    pairs.filter(p => p.from.is_major).forEach(p => expect(p.to.is_major).toBe(true))
  })

  it.skip('#3. Sorting by Liquidity', () => {
    // NOTE: to be implemented later
  })

})


describe('Testing TokenPairList', () => {
  // Given initial selected paris: [TOMO/BTC, ETH/TOMO]
  const tomoAddr = Tokens.find(t => t.symbol === 'TOMO').address
  const btcAddr = Tokens.find(t => t.symbol === 'BTC').address
  const ethAddr = Tokens.find(t => t.symbol === 'ETH').address

  const quoteTokens = Tokens.filter(t => t.is_major)

  const fromTokens = [tomoAddr, ethAddr]
  const toTokens = [btcAddr, tomoAddr]

  afterEach(cleanup)


  it('#1 MapStateToProps & MakeCheckList should behave properly', () => {
    expect(pairs.length).toEqual(Object.keys(pairMapping).length)
    const firstKey = `${pairs[0].from.address}${pairs[0].to.address}`
    expect(pairMapping[firstKey]).toBe(0)

    const checkList = MakeCheckList(fromTokens, toTokens, pairs, pairMapping)
    // Refer to `quoteTokensAtListHead` above
    checkList.forEach((p, idx) => {
      expect(Boolean(p.checked)).toBe(idx === 0 || idx === 5)
    })
  })


  it('#2. Testing FilterControl', async () => {
    let result
    const changeFilters = filter => {
      result = pairs.filter(filter)
    }

    const majorTokens = Tokens.filter(t => t.is_major)

    const {
      getByText,
      getByLabelText,
    } = render(<FilterControl onFilterChange={changeFilters} tokensForFilter={majorTokens} />)

    const ALLBtn = getByText('ALL')
    const TOMOBtn = getByText('TOMO')
    getByText('BTC')
    getByText('ETH')
    getByLabelText('Search')

    fireEvent.click(TOMOBtn)
    const expectedFilteredPair = pairs.filter(p => p.from.address === tomoAddr || p.to.address === tomoAddr).map(p => p.toString())
    expect(expectedFilteredPair.length).toEqual(result.length)
    expect(result.every(p => expectedFilteredPair.includes(p.toString()))).toBe(true)

    fireEvent.click(ALLBtn)
    expect(pairs.length).toEqual(result.length)

  })


  it('#3. TokenPairList should render properly and selected token-paris can be change on check/uncheck', () => {
    let result
    const onChange = data => {
      expect(data.fromTokens.length).toEqual(data.toTokens.length)
      result = data
    }

    const {
      container,
    } = render((
      <TokenPairList
        fromTokens={fromTokens}
        toTokens={toTokens}
        quoteTokens={quoteTokens}
        pairs={pairs}
        pairMapping={pairMapping}
        onChange={onChange}
      />
    ))

    const inputs = Array.from(container.querySelectorAll('input'))
    expect(inputs.length).toEqual(pairs.length + 1)
    expect(inputs[1]).toHaveAttribute('checked')
    expect(inputs[6]).toHaveAttribute('checked')
    expect(inputs[4]).not.toHaveAttribute('checked')

    fireEvent.click(inputs[4])
    expect(result.fromTokens.length).toBe(3)

    fireEvent.click(inputs[6])
    expect(result.fromTokens.length).toBe(2)
  })

})
