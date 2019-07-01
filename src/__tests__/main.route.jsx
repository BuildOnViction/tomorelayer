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
import * as blk from 'service/blockchain'
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
  id: 1,
  name: 'RelayerOne',
  owner: testWalletAddress,
  coinbase: 'xxx',
  maker_fee: 1,
  taker_fee: 50,
  from_tokens: [],
  to_tokens: [],
}

const DummyRelayerTwo = {
  id: 2,
  name: 'RelayerTwo',
  owner: testWalletAddress,
  coinbase: 'yyy',
  maker_fee: 20,
  taker_fee: 3,
  from_tokens: [],
  to_tokens: [],
}


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
    Tokens: Tokens,
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


  it('Logged-in user can view their relayers', async () => {
    mockLogin(mockedWalletSigner)
    const relayerMenu = await findByText(/your relayers/i)

    fireEvent.click(relayerMenu)

    const firstRelayer = await findByText(new RegExp(DummyRelayerOne.name), 'i')
    getByText(new RegExp(DummyRelayerTwo.name), 'i')
    getByText(/create new relayer/i)

    fireEvent.click(firstRelayer)
    await findByText(new RegExp(`Dashboard of Relayer ${DummyRelayerOne.name}`), 'i')
  })


  it('Test Relayer-Info Config', async () => {
    const configTab = getByText(/Configuration/i)
    fireEvent.click(configTab)

    await findByText(/info/i)
    getByText(/trade/i)
    getByText(/transfer/i)
    getByText(/resign/i)

    // NOTE: default is Info Form
    const relayerNameInput = getByDisplayValue(DummyRelayerOne.name)
    getByLabelText(/name/i)
    getByLabelText(/link/i)
    getByLabelText(/logo/i)
    const saveBtn = container.querySelector('button[type="submit"]')


    const testChangeName = 'TestNameOne'
    http.updateRelayer = jest.fn().mockResolvedValue({
      ...DummyRelayerOne,
      name: testChangeName,
    })

    fireEvent.change(relayerNameInput, { target: { value: testChangeName }})
    fireEvent.click(saveBtn)

    await wait(() => {
      expect(http.updateRelayer).toHaveBeenCalledWith({ id: 1, name: testChangeName })
    })

  })


  it('Test Relayer-Trade Config', async () => {
    const tradeOption = getByText(/trade options/i)
    fireEvent.click(tradeOption)

    await findByLabelText(/maker fee/i)
    const makerFeeInput = getByDisplayValue(new RegExp(((DummyRelayerOne.maker_fee / 100).toString())), 'i')

    getByText(/taker fee/i)
    getByDisplayValue(new RegExp(((DummyRelayerOne.taker_fee / 100).toString())), 'i')

    const saveBtn = container.querySelector('button[type="submit"]')
    const sampleTokenPair = getByText(/tomo\/btc/i)

    const TomoAddr = Tokens.find(t => t.symbol === 'TOMO').address
    const BtcAddr = Tokens.find(t => t.symbol === 'BTC').address

    fireEvent.change(makerFeeInput, { target: { value: 0.08 }})
    await wait()

    fireEvent.click(sampleTokenPair)
    await wait()

    http.updateRelayer = jest.fn()
    blk.updateRelayer = jest.fn().mockResolvedValue({ status: true })

    fireEvent.click(saveBtn)

    await wait(() => {
      const expectedPayload = {
        ...DummyRelayerOne,
        maker_fee: 8,
        from_tokens: [TomoAddr],
        to_tokens: [BtcAddr],
      }

      expect(blk.updateRelayer).toHaveBeenCalledWith(expectedPayload)
      expect(http.updateRelayer).toHaveBeenCalledWith(expectedPayload)

    })

  })

})
