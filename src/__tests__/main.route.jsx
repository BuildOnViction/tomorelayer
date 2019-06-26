import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from '@testing-library/react'
import 'jest-dom/extend-expect'
import { Provider } from '@vutr/redux-zero/react'
import createStore from '@vutr/redux-zero'

import { initialState} from 'service/store'
import App from 'component/App'


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
    findAllByText,
    findByLabelText,
    findAllByLabelText,
    getByDisplayValue,
    // eslint-disable-next-line
    debug;

let countInputs
let container

beforeAll(() => {
  const store = createStore(initialState)

  const renderUtils = render(
    <Provider store={store}>
      <App />
    </Provider>
  )

  container = renderUtils.container
  getByText = renderUtils.getByText
  getByLabelText = renderUtils.getByLabelText
  getByDisplayValue = renderUtils.getByDisplayValue
  findByText = renderUtils.findByText
  findAllByText = renderUtils.findAllByText
  findByLabelText = renderUtils.findByLabelText
  findAllByLabelText = renderUtils.findAllByLabelText
  debug = renderUtils.debug
})

afterAll(cleanup)

/**
 * this is test for Authentication Class
 * @test {Authentication}
 */
describe('Test Main App', () => {

  /**
   * @test {TomoWallet}
   * proper render, with Header, Logo and TomoWallet as default methodBar
   * After unlock with TomoWallet, a new instance of Wallet & Balance shown properly
   */
  it('Render without crash', async () => {
    getByText(/login/i)
  })

})
