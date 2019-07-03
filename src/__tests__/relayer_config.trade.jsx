import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  wait,
} from '@testing-library/react'
import 'jest-dom/extend-expect'
import { Provider, connect } from '@vutr/redux-zero/react'
import createStore from '@vutr/redux-zero'
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

const Owner = '0x21022a96AA9c06B0e2B021FC7D92E8Cab94BF390'

describe('Test Relayer-Config Trade Form', () => {

  afterEach(cleanup)

  it('Request update trade-options for Active Relayer', async () => {

    const ActiveRelayer = {
      id: 1,
      owner: Owner,
      maker_fee: 1,
      taker_fee: 2,
      from_tokens: [],
      to_tokens: [],
    }

    const mockUpdateFunction = jest.fn()
                                   .mockResolvedValueOnce({ status: false, details: 'fake error' })
                                   .mockResolvedValueOnce({ status: true })

    const store = createStore({
      ...initialState,
      Relayers: [ActiveRelayer],
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

    R.getByDisplayValue(/0.01/)
    const takerFeeInput = R.getByDisplayValue(/0.02/)
    const saveBtn = R.getByTestId(/save-button/i)


    http.updateRelayer = jest.fn().mockResolvedValue({
      ...ActiveRelayer,
      taker_fee: 50,
    })

    fireEvent.change(takerFeeInput, { target: { value: 0.5 }})
    fireEvent.click(saveBtn)
    await wait()

    expect(mockUpdateFunction).toHaveBeenCalledWith({ ...ActiveRelayer, taker_fee: 50 })
    expect(http.updateRelayer).not.toHaveBeenCalled()
    R.getByText(/fake error/i)

    expect(saveBtn).not.toBeDisabled()
    fireEvent.click(saveBtn)
    await wait()

    expect(http.updateRelayer).toHaveBeenCalledWith({ ...ActiveRelayer, taker_fee: 50 })
    R.getByText(/relayer trade options updated/i)
  })


  it('Request update trade options for ResigningRelayer', async () => {

    const ActiveRelayer = {
      id: 1,
      owner: Owner,
      maker_fee: 1,
      taker_fee: 2,
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

    const makerFeeInput = R.getByDisplayValue(/0.01/)
    const takerFeeInput = R.getByDisplayValue(/0.02/)
    const someTokenPair = R.getByLabelText(/tomo\/btc/i)
    const saveBtn = R.getByTestId(/save-button/i)


    expect(makerFeeInput).toBeDisabled()
    expect(takerFeeInput).toBeDisabled()
    expect(someTokenPair).toBeDisabled()
    expect(saveBtn).toBeDisabled()
  })


})
