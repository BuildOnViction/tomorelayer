import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  wait,
} from '@testing-library/react'
import 'jest-dom/extend-expect'
import { Provider, connect } from 'redux-zero/react'
import createStore from 'redux-zero'
import { initialState } from 'service/store'
import * as http from 'service/backend'
import FormTrade from 'component/route/Dashboard/ConfigForms/FormTrade'
import Alert from 'component/shared/Alert'


global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  }
})


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

const TomoAddress = Tokens.find(r => r.symbol === 'TOMO').address
const BtcAddress = Tokens.find(r => r.symbol === 'BTC').address

const Owner = '0x21022a96AA9c06B0e2B021FC7D92E8Cab94BF390'

describe('Test Relayer-Config Trade Form', () => {

  afterEach(cleanup)

  it('#1. Request update trade-options for Active Relayer', async () => {

    const ActiveRelayer = {
      id: 1,
      owner: Owner,
      trade_fee: 2,
      from_tokens: [],
      to_tokens: [],
    }

    const mockUpdateFunction = jest.fn()
                                   .mockResolvedValueOnce({ status: false, details: 'fake error' })
                                   .mockResolvedValueOnce({ status: true })

    const store = createStore({
      ...initialState,
      Relayers: [ActiveRelayer],
      Tokens: Tokens,
      blk: {
        RelayerContract: {
          update: mockUpdateFunction
        }
      }
    })

    const ParentComponent = connect(
      state => ({ relayers: state.Relayers })
    )(({ relayers }) => (
      <div>
        <Alert />
        <FormTrade relayer={relayers.find(r => r.id === ActiveRelayer.id)} />
      </div>
    ))

    const R = render(
      <Provider store={store}>
        <ParentComponent />
      </Provider>
    )

    const tradeFeeInput = R.getByDisplayValue(/0.02/)
    const someTokenPair = R.getByLabelText(/tomo\/btc/i)
    const saveBtn = R.getByTestId(/save-button/i)

    http.updateRelayer = jest.fn().mockResolvedValue({
      ...ActiveRelayer,
      trade_fee: 50,
    })

    fireEvent.change(tradeFeeInput, { target: { value: 0.5 }})
    fireEvent.click(someTokenPair)
    fireEvent.click(saveBtn)
    await wait()

    const expectedUpdatePayload = {
      ...ActiveRelayer,
      trade_fee: 50,
      from_tokens: [TomoAddress],
      to_tokens: [BtcAddress],
    }

    expect(mockUpdateFunction).toHaveBeenCalledWith(expectedUpdatePayload)
    expect(http.updateRelayer).not.toHaveBeenCalled()
    R.getByText(/fake error/i)

    expect(saveBtn).not.toBeDisabled()
    fireEvent.click(saveBtn)
    await wait()

    expect(http.updateRelayer).toHaveBeenCalledWith(expectedUpdatePayload)
    R.getByText(/relayer trade options updated/i)
  })


  it('#2. Request update trade options for ResigningRelayer', async () => {

    const ActiveRelayer = {
      id: 1,
      owner: Owner,
      trade_fee: 1,
      from_tokens: [],
      to_tokens: [],
      resigning: true,
    }

    const store = createStore({
      ...initialState,
      Relayers: [ActiveRelayer],
      Tokens: Tokens,
    })

    const ParentComponent = connect(
      state => ({ relayers: state.Relayers })
    )(({ relayers }) => (
      <div>
        <Alert />
        <FormTrade relayer={relayers.find(r => r.id === ActiveRelayer.id)} />
      </div>
    ))

    const R = render(
      <Provider store={store}>
        <ParentComponent />
      </Provider>
    )

    const tradeFeeInput = R.getByDisplayValue(/0.01/)
    const someTokenPair = R.getByLabelText(/tomo\/btc/i)
    const saveBtn = R.getByTestId(/save-button/i)


    expect(tradeFeeInput).toBeDisabled()
    expect(someTokenPair).toBeDisabled()
    expect(saveBtn).toBeDisabled()
  })


})
