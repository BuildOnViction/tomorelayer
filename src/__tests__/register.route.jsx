import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
} from '@testing-library/react'
import 'jest-dom/extend-expect'
import { HashRouter } from 'react-router-dom'

import { Provider } from 'redux-zero/react'
import createStore from 'redux-zero'

import setup from './_database.setup.js'

import { MISC } from 'service/constant'
import Register from 'component/route/Register'
import Alert from 'component/shared/Alert'

import { initialState } from 'service/store'

/**
 * Testing Actions for Register Flow
 * @test {RegisterComponent}
 * - Here we test all actions that will be used for registration flow
 * - all blockchain functions will be mocked
 * - yet, backend functions will all be tested through
 * - Registration form will be a Wizard Form, but some of its actions will be mutating state
 */


let countInputs
let container

const userAddress = '0x070aA7AD03B89B3278f19d34F119DD3C2a244675'
const usedCoinbase = '0x504812e482877a37b1998df30f78d5e79c836f51'
const otherOnwer = '0x9d31e5d37262264697ffa7257f323ad4b87432f9'

const finalPayload = {
  coinbase: '0x2db13BfFD639c756383e98BCb34BB918Ae5A5b12',
  deposit: '25000',
  name: 'abcxyz',
}

let getByText,
    getByTestId,
    findByText,
    findByLabelText,
    // eslint-disable-next-line
    debug;

let mockedRelayerContract

beforeAll(() => {
  const fs = require('fs')
  const path = require('path')
  const rawtokens = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/_token.dummy.json')))
  const quoteTokens = ['TOMO', 'ETH', 'BTC']
  const Tokens = rawtokens.map((t, idx) => {
    if (quoteTokens.includes(t.symbol)) {
      t['is_major'] = true
    }
    t.id = idx
    return t
  })

  const mockedWalletSigner = {
    getAddress: async () => Promise.resolve(userAddress),
  }

  mockedRelayerContract = Object.create({
    wallet: mockedWalletSigner,
    async register() { return { status: true } },
  })

  const store = createStore({
    ...initialState,
    user: {
      ...initialState.user,
      wallet: mockedWalletSigner,
    },
    Tokens: Tokens,
    Relayers: [
      {coinbase: usedCoinbase, owner: otherOnwer}
    ],
    blk: {
      RelayerContract: mockedRelayerContract
    }
  })


  const renderUtils = render((
    <Provider store={store}>
      <HashRouter>
        <div>
          <Alert />
          <Register />
        </div>
      </HashRouter>
    </Provider>
  ))

  container = renderUtils.container
  getByText = renderUtils.getByText
  getByTestId = renderUtils.getByTestId
  findByText = renderUtils.findByText
  findByLabelText = renderUtils.findByLabelText
  debug = renderUtils.debug

  countInputs = () => Array.from(container.querySelectorAll('input')).length
})

afterAll(cleanup)

describe('Test RegisterForm No Break', () => {
  /**
   * this is test for RegisterForm.
   * RegisterForm will be a Wizard Form
   * It is built using Formik, and should retain values after each steps
   * Form submission should present a valid payload
   * @test {RegisterForm}
   */

  let conn

  beforeAll(async () => {
    conn = await setup()
  })

  afterAll(async () => {
    await conn.drop()
    await conn.close()
  })

  it('#Step 1: deposit & coinbase form', async () => {
    const validCoinbase = finalPayload.coinbase
    expect(countInputs()).toBe(2)

    const depositInput = getByTestId('deposit-input')
    const coinbaseInput = getByTestId('coinbase-input')
    expect(parseInt(depositInput.value, 10)).toEqual(MISC.MinimumDeposit)

    expect(getByText(/confirm/i)).toBeInTheDocument()
    // NOTE: cannot use getByText('Confirm') to find button,
    // because MUI wraps the content within a SPAN element inside button
    const submitButton = container.querySelector('button[type="submit"]')

    expect(depositInput).toBeInTheDocument()
    expect(coinbaseInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()

    fireEvent.change(coinbaseInput, { target: { value: userAddress } })
    expect(coinbaseInput).toHaveValue(userAddress)
    fireEvent.click(submitButton)
    await findByText(/coinbase cannot be the same as owner address/i)

    fireEvent.change(depositInput, { target: { value: '22000' } })
    fireEvent.click(submitButton)
    await findByText(/minimum deposit is 25,000 TOMO/i)

    // Valid submit, unmount Step 1, successfully move to step 2
    fireEvent.change(coinbaseInput, { target: { value: validCoinbase } })
    fireEvent.change(depositInput, { target: { value: '25000' } })
    fireEvent.click(submitButton)
    await findByLabelText('Relayer Name')
    expect(countInputs()).toBe(1)
  })


})
