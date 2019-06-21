import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  wait,
  waitForElement,
  waitForDomChange,
} from '@testing-library/react'
import 'jest-dom/extend-expect'

import {
  TokenPairList,
  PairList,
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

afterAll(cleanup)

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

  it('#1 MapStateToProps should produce correct PairMapping', () => {
    expect(pairs.length).toEqual(Object.keys(pairMapping).length)
    const firstKey = `${pairs[0].from.address}${pairs[0].to.address}`
    expect(pairMapping[firstKey]).toBe(0)
  })

  it('#2 MakeCheckList is correct & PairList should render properly', async () => {
    // Given initial selected paris: [TOMO/BTC, ETH/TOMO]
    const tomoAddr = Tokens.find(t => t.symbol === 'TOMO').address
    const btcAddr = Tokens.find(t => t.symbol === 'BTC').address
    const ethAddr = Tokens.find(t => t.symbol === 'ETH').address

    const fromTokens = [tomoAddr, ethAddr]
    const toTokens = [btcAddr, tomoAddr]

    const checkList = MakeCheckList(fromTokens, toTokens, pairs, pairMapping)
    // Refer to `quoteTokensAtListHead` above
    checkList.forEach((p, idx) => {
      expect(Boolean(p.checked)).toBe(idx === 0 || idx === 5)
    })

    let newlist
    const onCheck = list => { newlist = list }
    const {
      getAllByText,
      getByLabelText,
      findByLabelText,
      debug,
      container,
    } = render((<PairList items={checkList} onCheck={onCheck} />))

    const checkboxes = Array.from(container.querySelectorAll('input'))
    expect(checkboxes.length).toEqual(pairs.length)

    // NOTE: getByLabelText(ariaLabel(firstPair)) not working,
    // as Test engine cannot find label maybe due to how MUI render
    const inputs = Array.from(container.querySelectorAll('input'))
    expect(inputs[0]).toHaveAttribute('checked')
    expect(inputs[5]).toHaveAttribute('checked')
    expect(inputs[3]).not.toHaveAttribute('checked')

    fireEvent.click(inputs[3])
    const pickedPair = newlist[3]
    expect(pickedPair.checked).toBe(true)

    fireEvent.click(inputs[5])
    const uncheckedPair = newlist[5]
    expect(uncheckedPair.checked).toBe(undefined)
  })

})
