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
import { bindActions } from '@vutr/redux-zero/utils'
import createStore from '@vutr/redux-zero'

import * as http from 'service/backend'
import { initialState } from 'service/store'
import App from 'component/App'

/**
 * Testing Actions for Register Flow
 * @test {RegisterComponent}
 * - Here we test all actions that will be used for registration flow
 * - all blockchain functions will be mocked
 * - yet, backend functions will all be tested through
 * - Registration form will be a Wizard Form, but some of its actions will be mutating state
 */

global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  }
})



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

let store

const testWalletAddress = '0x21022a96AA9c06B0e2B021FC7D92E8Cab94BF390'


const DummyRelayerOne = {
  name: 'RelayerOne',
  owner: testWalletAddress,
  coinbase: 'xxx',
  maker_fee: 1,
  taker_fee: 50,
  from_tokens: [],
  to_tokens: [],
}

const DummyRelayerTwo = {
  name: 'RelayerTwo',
  owner: testWalletAddress,
  coinbase: 'yyy',
  maker_fee: 20,
  taker_fee: 3,
  from_tokens: [],
  to_tokens: [],
}


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

  // NOTE: we create some bindAction and call them to manually change state-store for testing
  const mockedWalletSigner = {
    getAddress: async () => Promise.resolve(testWalletAddress),
  }

  const mockLogin = wallet => bindActions({
    saveWallet: (state, wallet) => ({
      user: { ...state.user, wallet }
    })
  }, store).saveWallet(wallet)

  const spyBackend = jest.spyOn(http, 'getPublicResource')
  spyBackend.mockReturnValue({
    Relayers: [DummyRelayerOne, DummyRelayerTwo],
    Tokens: [],
    Contracts: [],
  })


  it('Render without crash', async () => {

    store = createStore(initialState)

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

    await wait(() => {
      getByText(/fetched all resources/i)
    })

    getByText(/login/i)
    getByText(/start a relayer/i)

  })


  it('LoggedInn user can view their relayers', async () => {
    mockLogin(mockedWalletSigner)
    const relayerMenu = await findByText(/your relayers/i)

    fireEvent.click(relayerMenu)

    const firstRelayer = await findByText(new RegExp(DummyRelayerOne.name), 'i')
    getByText(new RegExp(DummyRelayerTwo.name), 'i')
    getByText(/create new relayer/i)

    fireEvent.click(firstRelayer)
    await findByText(/Dashboard of Relayer/i)
  })

})
