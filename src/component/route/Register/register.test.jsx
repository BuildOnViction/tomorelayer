import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
} from '@testing-library/react'
import 'jest-dom/extend-expect'
import { MISC } from 'service/constant'
import { Register } from './index'

/**
 * Testing Actions for Register Flow
 * @test {RegisterComponent}
 * - Here we test all actions that will be used for registration flow
 * - all blockchain functions will be mocked
 * - yet, backend functions will all be tested through
 * - Registration form will be a Wizard Form, but some of its actions will be mutating state
 */

afterAll(cleanup)

describe('Test RegisterForm No Break', () => {
  /**
   * this is test for RegisterForm.
   * RegisterForm will be a Wizard Form
   * It is built using Formik, and should retain values after each steps
   * Form submission should present a valid payload
   * @test {RegisterForm}
   */

  let renderUtils
  let countInputs
  let container

  const finalPayload = {
    coinbase: '0x2db13BfFD639c756383e98BCb34BB918Ae5A5b12',
    deposit: '25000',
    name: 'abcxyz',
  }

  it('#Step 1: deposit & coinbase form', async () => {
    const validCoinbase = finalPayload.coinbase
    const userAddress = '0x070aA7AD03B89B3278f19d34F119DD3C2a244675'
    const usedCoinbases = []
    renderUtils = render(<Register userAddress={userAddress} usedCoinbases={usedCoinbases} />)
    const {
      getByText,
      getByLabelText,
      findByText,
      findByLabelText,
    } = renderUtils
    container = renderUtils.container

    countInputs = () => Array.from(container.querySelectorAll('input')).length
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
    const {
      getByLabelText,
      findByText,
      findByLabelText,
      container,
    } = renderUtils

    expect(countInputs()).toBe(1)
    let nameInput = getByLabelText('Relayer Name')
    let submitButton = container.querySelector('button[type="submit"]')
    const backButton = container.querySelector('button[type="button"]')

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

})
