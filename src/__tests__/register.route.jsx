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
import { Register } from 'component/route/Register'

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
const usedCoinbases = []

const finalPayload = {
  coinbase: '0x2db13BfFD639c756383e98BCb34BB918Ae5A5b12',
  deposit: '25000',
  name: 'abcxyz',
}

let getByText,
    getAllByText,
    getByLabelText,
    findByText,
    findAllByText,
    findByLabelText,
    findAllByLabelText,
    debug;

beforeAll(() => {
  const renderUtils = render((
    <Register
      userAddress={userAddress}
      usedCoinbases={usedCoinbases}
    />
  ))

  container = renderUtils.container
  getByText = renderUtils.getByText
  getAllByText = renderUtils.getAllByText
  getByLabelText = renderUtils.getByLabelText
  findByText = renderUtils.findByText
  findAllByText = renderUtils.findAllByText
  findByLabelText = renderUtils.findByLabelText
  findAllByLabelText = renderUtils.findAllByLabelText
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

  it('#Step 1: deposit & coinbase form', async () => {
    const validCoinbase = finalPayload.coinbase
    expect(countInputs()).toBe(2)

    const depositInput = getByLabelText('Deposit')
    const coinbaseInput = getByLabelText('Coinbase')
    expect(parseInt(depositInput.value)).toEqual(MISC.MinimumDeposit)

    expect(getByText(/confirm/i)).toBeInTheDocument()
    // NOTE: cannot use getByText('Confirm') to find button,
    // because MUI wraps the content within a SPAN element inside button
    const submitButton = container.querySelector('button[type="submit"]')

    expect(depositInput).toBeInTheDocument()
    expect(coinbaseInput).toBeInTheDocument()
    expect(submitButton).toBeInTheDocument()

    fireEvent.change(coinbaseInput, { target: { value: userAddress } })
    fireEvent.click(submitButton)
    await findByText(/invalid coinbase/i)

    fireEvent.change(coinbaseInput, { target: { value: validCoinbase } })
    fireEvent.change(depositInput, { target: { value: '22000' } })
    fireEvent.click(submitButton)
    await findByText(/minimum deposit is 25,000 TOMO/i)

    // Valid submit, unmount Step 1, successfully move to step 2
    fireEvent.change(depositInput, { target: { value: '25000' } })
    fireEvent.click(submitButton)
    await findByLabelText('Relayer Name')
    expect(countInputs()).toBe(1)
  })

  it('#Step 2: relayer name', async () => {
    expect(countInputs()).toBe(1)
    let nameInput = getByLabelText('Relayer Name')
    let submitButton = container.querySelector('button[type="submit"]')
    const backButton = container.querySelector('button[type="button"]')

    // NOTE: name-length within 3~200
    const shortName = 'ab'
    const longName = Array.from({ length: 201 }).fill('a').join('')

    fireEvent.change(nameInput, { target: { value: shortName } })
    fireEvent.click(submitButton)
    await findByText(/name is too short/i)

    fireEvent.change(nameInput, { target: { value: longName } })
    fireEvent.click(submitButton)
    await findByText(/name is too long/i)

    // Going back and forth between steps
    fireEvent.click(backButton)
    const coinbaseInput = await findByLabelText('Coinbase')
    expect(coinbaseInput.value).toBe(finalPayload.coinbase)
    expect(countInputs()).toBe(2)
    submitButton = container.querySelector('button[type="submit"]')
    fireEvent.click(submitButton)
    nameInput = await waitForElement(() => getByLabelText('Relayer Name'))

    // Submit FormStepTwo
    // Valid submit, unmount Step 1, successfully move to step 2
    submitButton = container.querySelector('button[type="submit"]')
    fireEvent.change(nameInput, { target: { value: finalPayload.name } })
    fireEvent.click(submitButton)

    await findByLabelText(/maker fee/i)
  })

  it('#Step 3: market fee form', async () => {
    expect(countInputs()).toBe(2)

    const makerFeeInput = getByLabelText(/maker fee/i)
    expect(parseFloat(makerFeeInput.value)).toEqual(0.01)
    expect(makerFeeInput.attributes['type'].value).toBe('number')
    expect(makerFeeInput.attributes['step'].value).toBe('0.01')
    expect(makerFeeInput.attributes['max'].value).toBe('99.99')
    expect(makerFeeInput.attributes['min'].value).toBe('0.01')

    const takerFeeInput = getByLabelText(/taker fee/i)
    expect(parseFloat(takerFeeInput.value)).toEqual(0.01)
    expect(takerFeeInput.attributes['type'].value).toBe('number')
    expect(takerFeeInput.attributes['step'].value).toBe('0.01')
    expect(takerFeeInput.attributes['max'].value).toBe('99.99')
    expect(takerFeeInput.attributes['min'].value).toBe('0.01')

    const submitButton = container.querySelector('button[type="submit"]')
    const invalidFee = 10000000 // not within 0.01 ~ 99.99
    fireEvent.change(makerFeeInput, { target: { value: invalidFee } })
    fireEvent.change(takerFeeInput, { target: { value: invalidFee } })
    fireEvent.click(submitButton)

    // NOTE: no alert, just using error-highlight from MUI's built-ins
    const updatedInputs = await findAllByLabelText(/maker fee/i)
    Array.from(updatedInputs).forEach(input => {
      expect(input.attributes['aria-invalid'].value).toBe('true')
    })
  })

})
