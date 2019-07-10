import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  wait,
  waitForElement,
} from '@testing-library/react'
import 'jest-dom/extend-expect'
import { HashRouter } from 'react-router-dom'

import { Provider } from 'redux-zero/react'
import createStore from 'redux-zero'

import setup from './_database.setup.js'

import * as http from 'service/backend'
import { initialState } from 'service/store'
import { MISC } from 'service/constant'
import Register from 'component/route/Register'
import Alert from 'component/shared/Alert'


/**
 * Testing Actions for Register Flow
 * @test {RegisterComponent}
 * - Here we test all actions that will be used for registration flow
 * - all blockchain functions will be mocked
 * - yet, backend functions will all be tested through
 * - Registration form will be a Wizard Form, but some of its actions will be mutating state
 */


let countInputs

const userAddress = '0x070aA7AD03B89B3278f19d34F119DD3C2a244675'
const usedCoinbase = '0x504812e482877a37b1998df30f78d5e79c836f51'
const otherOnwer = '0x9d31e5d37262264697ffa7257f323ad4b87432f9'

const finalPayload = {
  coinbase: '0x2db13BfFD639c756383e98BCb34BB918Ae5A5b12',
  deposit: '25000',
  name: 'abcxyz',
}

let mockedRelayerContract
let R

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
    register: jest.fn()
                  .mockResolvedValueOnce({ status: false, details: { error: 'fake error' } })
                  .mockResolvedValueOnce({ status: true })
  })

  const store = createStore({
    ...initialState,
    user: {
      ...initialState.user,
      wallet: mockedWalletSigner,
    },
    Tokens: Tokens,
    Relayers: [
      {
        coinbase: usedCoinbase,
        owner: otherOnwer,
        name: 'testname',
      }
    ],
    blk: {
      RelayerContract: mockedRelayerContract
    }
  })


  R = render((
    <Provider store={store}>
      <HashRouter>
        <div>
          <Alert />
          <Register />
        </div>
      </HashRouter>
    </Provider>
  ))

  countInputs = () => Array.from(R.container.querySelectorAll('input')).length
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

    const depositInput = R.getByTestId('deposit-input')
    const coinbaseInput = R.getByTestId('coinbase-input')
    expect(parseInt(depositInput.value, 10)).toEqual(MISC.MinimumDeposit)

    expect(R.getByText(/confirm/i)).toBeInTheDocument()
    // NOTE: cannot use R.getByText('Confirm') to find button,
    // because MUI wraps the content within a SPAN element inside button
    const submitButton = R.container.querySelector('button[type="submit"]')

    expect(depositInput).toBeInTheDocument()
    expect(coinbaseInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()

    fireEvent.change(coinbaseInput, { target: { value: userAddress } })
    expect(coinbaseInput).toHaveValue(userAddress)
    fireEvent.click(submitButton)
    await R.findByText(/coinbase cannot be the same as owner address/i)

    fireEvent.change(depositInput, { target: { value: '22000' } })
    fireEvent.click(submitButton)
    await R.findByText(/minimum deposit is 25,000 TOMO/i)

    // Valid submit, unmount Step 1, successfully move to step 2
    fireEvent.change(coinbaseInput, { target: { value: validCoinbase } })
    fireEvent.change(depositInput, { target: { value: '25000' } })
    fireEvent.click(submitButton)
    await R.findByLabelText('Relayer Name')
    expect(countInputs()).toBe(1)
  })


  it('#Step 2: relayer name', async () => {
    expect(countInputs()).toBe(1)
    let nameInput = R.getByLabelText('Relayer Name')
    let submitButton = R.container.querySelector('button[type="submit"]')
    const backButton = R.container.querySelector('button[type="button"]')

    // NOTE: name-length within 3~200
    const shortName = 'ab'
    const longName = Array.from({ length: 201 }).fill('a').join('')
    const duplicateName = 'testname'

    fireEvent.change(nameInput, { target: { value: shortName } })
    fireEvent.click(submitButton)
    await R.findByText(/name is too short/i)

    fireEvent.change(nameInput, { target: { value: longName } })
    fireEvent.click(submitButton)
    await R.findByText(/name is too long/i)

    fireEvent.change(nameInput, { target: { value: duplicateName } })
    fireEvent.click(submitButton)
    await R.findByText(/name is already used/i)

    // Going back and forth between steps
    fireEvent.click(backButton)
    const coinbaseInput = await R.getByTestId('coinbase-input')
    expect(coinbaseInput.value).toBe(finalPayload.coinbase)
    expect(countInputs()).toBe(2)
    submitButton = R.container.querySelector('button[type="submit"]')
    fireEvent.click(submitButton)
    nameInput = await waitForElement(() => R.getByLabelText('Relayer Name'))

    // Submit FormStepTwo
    // Valid submit, unmount Step 1, successfully move to step 2
    submitButton = R.container.querySelector('button[type="submit"]')
    fireEvent.change(nameInput, { target: { value: finalPayload.name } })
    fireEvent.click(submitButton)

    await R.findByLabelText(/trade fee/i)
  })

  it('#Step 3: market fee form', async () => {
    expect(countInputs()).toBe(1)

    const tradeFeeInput = R.getByLabelText(/trade fee/i)
    expect(parseFloat(tradeFeeInput.value)).toEqual(0.01)
    expect(tradeFeeInput.attributes['type'].value).toBe('number')
    expect(tradeFeeInput.attributes['step'].value).toBe('0.01')
    expect(tradeFeeInput.attributes['max'].value).toBe('99.99')
    expect(tradeFeeInput.attributes['min'].value).toBe('0.01')

    const submitButton = R.container.querySelector('button[type="submit"]')
    const invalidFee = 10000000 // not within 0.01 ~ 99.99
    fireEvent.change(tradeFeeInput, { target: { value: invalidFee } })
    fireEvent.click(submitButton)

    // NOTE: no alert, just using error-highlight from MUI's built-ins
    const updatedInputs = await R.findAllByLabelText(/trade fee/i)
    Array.from(updatedInputs).forEach(input => {
      expect(input.attributes['aria-invalid'].value).toBe('true')
    })

    fireEvent.change(tradeFeeInput, { target: { value: 10 } })
    fireEvent.click(submitButton)
    await R.findByText('Choose Trading Pairs of Token')
  })

  it('#Step 4: choose trading pair', async () => {

    const TOMO_BTC = R.getByText('TOMO/BTC')
    const ETH_TOMO = R.getByText('ETH/TOMO')

    fireEvent.click(TOMO_BTC)
    fireEvent.click(ETH_TOMO)

    const submitButton = R.container.querySelector('button[type="submit"]')
    fireEvent.click(submitButton)

    await R.findByText(/review/i)
  })

  it('#Step 5: review & register', async () => {
    R.getByText('10.00%')
    R.getByText(finalPayload.coinbase)
    R.getByText(finalPayload.name)
    R.getByText(/TOMO\/BTC/)
    R.getByText(/ETH\/TOMO/)

    const spied = jest.spyOn(http, 'createRelayer')
    spied.mockResolvedValue({
      ...finalPayload,
      id: 2,
    })

    const submitButton = R.getByText(/confirm/i)
    fireEvent.click(submitButton)

    await R.findByText(/fake error/i)

    fireEvent.click(submitButton)

    await wait()
  })

  it('#Step 6: success notify', async () => {
    await R.findByText(/success/i)
  })

})
