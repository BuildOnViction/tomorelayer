import React from 'react'
import ReactDOM from 'react-dom'
import { act, Simulate } from 'react-dom/test-utils'

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

let container

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null
})

describe('Test RegisterForm No Break', () => {
  /**
   * this is test for RegisterForm.
   * RegisterForm will be a Wizard Form
   * It is built using Formik, and should retain values after each steps
   * Form submission should present a valid payload
   * @test {RegisterForm}
   */
  it('#1. Register Step 1: deposit & coinbase', async () => {
    const validCoinbase = '0x2db13BfFD639c756383e98BCb34BB918Ae5A5b12'
    const userAddress = '0x070aA7AD03B89B3278f19d34F119DD3C2a244675'
    const usedCoinbases = []

    act(() => {
      ReactDOM.render(<Register userAddress={userAddress} usedCoinbases={usedCoinbases} />, container)
    })

    const inputs = Array.from(container.querySelectorAll('input'))
    const submitButton = container.querySelector('button[type="submit"]')
    expect(inputs.length).toBe(2)

    const depositInput = inputs[0]
    const coinbaseInput = inputs[1]

    expect(depositInput.name).toBe('deposit')
    expect(parseInt(depositInput.value)).toBe(MISC.MinimumDeposit)
    expect(coinbaseInput.name).toBe('coinbase')
    expect(coinbaseInput.value).toBe('')

    const beforeErrorText = Array.from(container.querySelectorAll('.text-alert'))
    expect(beforeErrorText.length).toBe(0)

    coinbaseInput.value = userAddress
    Simulate.change(coinbaseInput)

    act(() => {
      // NOTE: Simulate click on submitButton will not work.
      submitButton.dispatchEvent(new MouseEvent('click', {bubbles: true}))
      console.log('dispatch submit')
    })

    const waitForRender = new Promise(res => {
      setTimeout(() => {
        const afterErrorText = Array.from(container.querySelectorAll('.text-alert'))
        expect(afterErrorText.length).toBe(1)
        res()
      })
    })

    await waitForRender

    // Use a valid coinbase
    coinbaseInput.value = validCoinbase
    Simulate.change(coinbaseInput)

    act(() => {
      submitButton.dispatchEvent(new MouseEvent('click', {bubbles: true}))
      console.log('dispatch submit again')
    })

    const waitForReRender = new Promise(res => {
      setTimeout(() => {
        const afterErrorText = container.querySelectorAll('.text-alert')
        expect(Boolean(afterErrorText)).toBe(false)
        res()
      })
    })

    await waitForReRender

  })
})
