import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  wait,
  waitForElement,
  waitForDomChange,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import 'jest-dom/extend-expect'
import { MISC } from 'service/constant'
import { TokenPairList, mapProps } from 'component/shared/TokenPairList'

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


describe('Stateless Pair-Builder Function', () => {

  const quoteTokens = ['TOMO', 'ETH', 'BTC']
  const Tokens = rawtokens.map((t, idx) => {
    if (quoteTokens.includes(t.symbol)) {
      t['is_major'] = true
    }
    t.id = idx
    return t
  })

  const { pairs } = mapProps({ tradableTokens: Tokens })

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
