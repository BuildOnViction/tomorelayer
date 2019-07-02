import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  wait,
  waitForElement,
  waitForElementToBeRemoved,
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
    getAllByText,
    getByDisplayValue,
    getByTestId,
    findByText,
    findAllByText,
    findByLabelText,
    findByTestId,
    findAllByLabelText,
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
  coinbase: '0x91xxxzzz',
  maker_fee: 1,
  taker_fee: 50,
  from_tokens: [],
  to_tokens: [],
}

const DummyRelayerTwo = {
  id: 2,
  name: 'RelayerTwo',
  owner: testWalletAddress,
  coinbase: '0x101010101',
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
   * @test {App}
   * Here we test the almost-full-flow of the Main app, except some separated functional feature eg Authenticatino or Register
   * The test flow will go from:
   *
   * render -> fetch data -> user login -> view personal relayer -> making configuration changes ->
   * - info change: change name
   * - trade options change: add token pairs, change fee
   * - transfer coinbase: change coinbase, notify about such change
   * - transfer ownership: change owner completely, notify about such change
   * - go to another relayer, resign it
   * - withdraw money
   *
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

  http.getPublicResource = jest.fn().mockResolvedValue({
    Relayers: [DummyRelayerOne, DummyRelayerTwo],
    Tokens: Tokens,
    Contracts: [],
  })

  const testChangeName = 'TestNameOne'
  const testChangeCoinbase = '0x0000000000000001'



  it('Render without crash', async () => {

    store = createStore(initialState)

    const renderUtils = render(
      <Provider store={store}>
        <App />
      </Provider>
    )

    expect(http.getPublicResource).toHaveBeenCalled()

    container = renderUtils.container
    getByText = renderUtils.getByText
    getAllByText = renderUtils.getAllByText
    getByLabelText = renderUtils.getByLabelText
    getByDisplayValue = renderUtils.getByDisplayValue
    getByTestId = renderUtils.getByTestId
    findByText = renderUtils.findByText
    findByTestId = renderUtils.findByTestId
    findAllByText = renderUtils.findAllByText
    findByLabelText = renderUtils.findByLabelText
    findAllByLabelText = renderUtils.findAllByLabelText
    debug = renderUtils.debug

    await wait()

    getByText(/fetched all resources/i)
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
    // NOTE: not testing error input yet

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


    http.updateRelayer = jest.fn().mockResolvedValue({
      ...DummyRelayerOne,
      name: testChangeName,
    })

    fireEvent.change(relayerNameInput, { target: { value: testChangeName }})
    fireEvent.click(saveBtn)
    await wait()

    expect(http.updateRelayer).toHaveBeenCalledWith({ id: 1, name: testChangeName })

  })


  it('Test Relayer-Trade Config', async () => {
    // NOTE: not testing error input yet

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

    const expectedPayload = {
      ...DummyRelayerOne,
      name: testChangeName,
      maker_fee: 8,
      from_tokens: [TomoAddr],
      to_tokens: [BtcAddr],
    }

    http.updateRelayer = jest.fn().mockResolvedValue(expectedPayload)
    blk.updateRelayer = jest.fn().mockResolvedValue({ status: true })

    fireEvent.click(saveBtn)
    await wait()

    expect(blk.updateRelayer).toHaveBeenCalledWith(expectedPayload)
    expect(http.updateRelayer).toHaveBeenCalledWith(expectedPayload)
  })


  it('Test Relayer-Transfer Config', async () => {
    const transferMenuItem = getByText(/transfer/i)
    fireEvent.click(transferMenuItem)

    await findByText(/what you need to know/i)
    const proceedBtn = getByText(/i understand/i)

    fireEvent.click(proceedBtn)
    await wait()

    const currentCoinbaseHiddenInput = getByTestId(/current-coinbase-input/i)
    expect(currentCoinbaseHiddenInput).not.toBeVisible()

    getByDisplayValue(DummyRelayerOne.owner)
    const newCoinbaseInput = getByTestId(/new-coinbase-input/i)

    let transferRequestBtn = getByTestId(/proceed-transfer-request/i)
    // At least one of the two values must be channged to request transfer
    expect(transferRequestBtn).toBeDisabled()

    // Change coinbase should enable ProceedButton
    fireEvent.change(newCoinbaseInput, { target: { value: testChangeCoinbase }})
    await wait()

    expect(transferRequestBtn).not.toBeDisabled()

    fireEvent.click(transferRequestBtn)
    await wait()

    // Confirm-Dialog should appear
    let confirmBtn = getByTestId(/confirm-transfer-request/i)
    let cancelBtn = getByTestId(/cancel-transfer-request/i)

    // Click Cancel, the dialog should disappear
    fireEvent.click(cancelBtn)
    await waitForElementToBeRemoved(() => getByTestId(/confirm-transfer-request/i))

    // Proceed, dialog should appears again...
    transferRequestBtn = getByTestId(/proceed-transfer-request/i)
    expect(transferRequestBtn).not.toBeDisabled()
    fireEvent.click(transferRequestBtn)
    await wait()

    // NOTE: we have to mock the result before firing button event
    const expectedPayload = {
      currentCoinbase: DummyRelayerOne.coinbase,
      owner: DummyRelayerOne.owner,
      coinbase: testChangeCoinbase
    }

    blk.transferRelayer = jest.fn().mockResolvedValue({ status: true })
    http.updateRelayer = jest.fn().mockResolvedValue({ ...DummyRelayerOne, coinbase: testChangeCoinbase })

    // Confirm request: change coinbase of the current relayer
    confirmBtn = getByTestId(/confirm-transfer-request/i)
    fireEvent.click(confirmBtn)
    await wait()

    expect(blk.transferRelayer).toHaveBeenCalledWith(expectedPayload)
    expect(http.updateRelayer).toHaveBeenCalledWith({
      coinbase: testChangeCoinbase,
      owner: DummyRelayerOne.owner,
      id: DummyRelayerOne.id,
    })

    getByText(/relayer transfered successfuly/i)
    // NOTE: because relayer coinbase changed, current route can no longer show valid relayer data
    // we prompt a notification about this
    getByText(/relayer doesnt exist/i)

  })

})
