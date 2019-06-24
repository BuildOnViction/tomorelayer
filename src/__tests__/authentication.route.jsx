import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from '@testing-library/react'
import 'jest-dom/extend-expect'
import { HashRouter } from 'react-router-dom'

import { Provider } from '@vutr/redux-zero/react'
import createStore from '@vutr/redux-zero'

import { MISC } from 'service/constant'
import Authentication from 'component/route/Authentication'

import * as blk from 'service/blockchain'
import { initialState } from 'service/store'

/**
 * Testing Actions for Register Flow
 * @test {RegisterComponent}
 * - Here we test all actions that will be used for registration flow
 * - all blockchain functions will be mocked
 * - yet, backend functions will all be tested through
 * - Registration form will be a Wizard Form, but some of its actions will be mutating state
 */


let getByText,
    getByLabelText,
    findByText,
    findByLabelText,
    findAllByLabelText,
    // eslint-disable-next-line
    debug;

let countInputs
let container

beforeAll(() => {
  const store = createStore(initialState)

  const renderUtils = render(
    <Provider store={store}>
      <HashRouter>
        <Authentication />
      </HashRouter>
    </Provider>
  )

  container = renderUtils.container
  getByText = renderUtils.getByText
  getByLabelText = renderUtils.getByLabelText
  findByText = renderUtils.findByText
  findByLabelText = renderUtils.findByLabelText
  findAllByLabelText = renderUtils.findAllByLabelText
  debug = renderUtils.debug
})

afterAll(cleanup)

describe('Test RegisterForm No Break', () => {
  /**
   * this is test for Authentication.
   * RegisterForm will be a Wizard Form
   * It is built using Formik, and should retain values after each steps
   * Form submission should present a valid payload
   * @test {RegisterForm}
   */

  it('#Step 1: deposit & coinbase form', async () => {
    getByText(/welcome/i)
  })

})
