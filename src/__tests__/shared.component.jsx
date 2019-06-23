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
import { Provider, connect } from '@vutr/redux-zero/react'
import createStore from '@vutr/redux-zero'

import TokenPairList, {
  mapProps as MapStateToProps,
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

const { pairs } = MapStateToProps({ tradableTokens: Tokens })


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

  let testRender

  afterAll(cleanup)


  it('#1 List should work with check/uncheck as expected', async () => {

    let testingValue = {}

    const ParentComponent = class extends React.Component {
      state = {
        value: {
          'from_tokens': [tomoAddr, btcAddr],
          'to_tokens': [ethAddr, tomoAddr],
        }
      }

      onChange = pairs => {
        testingValue = pairs

        const value = {
          from_tokens: pairs.map(p => p.from.address),
          to_tokens: pairs.map(p => p.to.address),
        }

        this.setState({ value })
      }

      render() {
        return (
          <TokenPairList
            onChange={this.onChange}
            value={this.state.value}
          />
        )
      }
    }

    const store = createStore({
      tradableTokens: Tokens
    })

    testRender = render(
      <Provider store={store}>
        <ParentComponent />
      </Provider>
    )

    const {
      getByText,
      getAllByText,
      getByLabelText,
      getAllByLabelText,
      getByPlaceholderText,
      findByText,
      findAllByText,
      container,
    } = testRender

    const Checkboxes = Array.from(container.querySelectorAll('input[type="checkbox"]'))
    expect(Checkboxes.length).toEqual(pairs.length)

    const TOMO_ETH_Checkbox = getByLabelText('TOMO/ETH')
    expect(TOMO_ETH_Checkbox.checked).toBe(true)

    const BTC_TOMO_Checkbox = getByLabelText('BTC/TOMO')
    expect(BTC_TOMO_Checkbox.checked).toBe(true)

    const firstCheckbox = getByLabelText('TOMO/BTC')
    expect(firstCheckbox).toBe(Checkboxes[0])

    // NOTE: user can just click on MenuItem instead of direct interaction with checkbox
    const FirstRowItem = getByText('TOMO/BTC')
    fireEvent.click(FirstRowItem)
    expect(firstCheckbox.checked).toBe(true)
    expect(testingValue.length).toBe(3)

  })

  it('#2 Testing filter', async () => {
    const {
      getByText,
      getAllByText,
      getByLabelText,
      getAllByLabelText,
      getByPlaceholderText,
      findByText,
      findAllByText,
      container,
      debug
    } = testRender

    const ALLButton = getByText('ALL')
    const TOMOButton = getByText('TOMO')
    const ETHButton = getByText('ETH')
    const BTCButton = getByText('BTC')
    const SearchInput = getByPlaceholderText(/search/i)


    const TOMO_RelatedPairs = pairs.filter(p => p.toString().includes('TOMO'))
    fireEvent.click(TOMOButton)
    let Checkboxes = Array.from(container.querySelectorAll('input[type="checkbox"]'))
    expect(Checkboxes.length).toEqual(TOMO_RelatedPairs.length)

    const firstCheckbox = getByLabelText('TOMO/BTC')
    expect(firstCheckbox).toBe(Checkboxes[0])

    const ETH_RelatedPairs = pairs.filter(p => p.toString().includes('ETH'))
    fireEvent.click(ETHButton)
    Checkboxes = Array.from(container.querySelectorAll('input[type="checkbox"]'))
    expect(Checkboxes.length).toEqual(ETH_RelatedPairs.length)

    fireEvent.click(ALLButton)
    Checkboxes = Array.from(container.querySelectorAll('input[type="checkbox"]'))
    expect(Checkboxes.length).toEqual(pairs.length)

    fireEvent.change(SearchInput, { target: { value: 'et' } })
    let Search_RelatedPairs = pairs.filter(pair => /et/i.exec(`${pair.toString()}${pair.from.name}${pair.to.name}`))
    await wait(() => {
      Checkboxes = Array.from(container.querySelectorAll('input[type="checkbox"]'))
      expect(Checkboxes.length).toEqual(Search_RelatedPairs.length)
    })

    fireEvent.change(SearchInput, { target: { value: 'ii' } })
    Search_RelatedPairs = pairs.filter(pair => /ii/i.exec(`${pair.toString()}${pair.from.name}${pair.to.name}`))
    await wait(() => {
      Checkboxes = Array.from(container.querySelectorAll('input[type="checkbox"]'))
      expect(Checkboxes.length).toEqual(Search_RelatedPairs.length)
    })

    const BTC_RelatedPairs = pairs.filter(p => p.toString().includes('BTC'))
    fireEvent.click(BTCButton)
    Checkboxes = Array.from(container.querySelectorAll('input[type="checkbox"]'))
    expect(Checkboxes.length).toEqual(BTC_RelatedPairs.length)

  })



})
