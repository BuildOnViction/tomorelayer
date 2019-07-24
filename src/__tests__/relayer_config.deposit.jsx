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
import * as blk from 'service/blockchain'
import FormDeposit from 'component/route/Dashboard/ConfigForms/FormDeposit'
import Alert from 'component/shared/Alert'


global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  }
})


const Owner = '0x21022a96AA9c06B0e2B021FC7D92E8Cab94BF390'

describe('Test Relayer-Config Trade Form', () => {

  afterEach(cleanup)

  it('Request deposit for Active Relayer', async () => {

    const ActiveRelayer = {
      id: 1,
      owner: Owner,
      deposit: 1000,
      trade_fee: 2,
      from_tokens: [],
      to_tokens: [],
    }

    const mockBlkDepositFunction = jest.fn()
                                   .mockResolvedValueOnce({ status: false, details: 'fake error' })
                                   .mockResolvedValueOnce({ status: true })

    const store = createStore({
      ...initialState,
      Relayers: [ActiveRelayer],
      blk: {
        RelayerContract: {
          depositMore: mockBlkDepositFunction
        }
      }
    })

    const ParentComponent = connect(
      state => ({ relayers: state.Relayers })
    )(({ relayers }) => (
      <div>
        <Alert />
        <FormDeposit relayer={relayers.find(r => r.id === ActiveRelayer.id)} />
      </div>
    ))

    const R = render(
      <Provider store={store}>
        <ParentComponent />
      </Provider>
    )

    http.updateRelayer = jest.fn().mockResolvedValue({
      ...ActiveRelayer,
      deposit: 1500,
    })

    const depositInput = R.getByTestId(/deposit-input/)
    expect(depositInput).toHaveValue(0)
    const confirmBtn = R.getByTestId(/confirm-button/i)
    expect(confirmBtn).toBeDisabled()

    // Minimum 1 TOMO
    fireEvent.change(depositInput, { target: { value: 0.99 }})
    expect(confirmBtn).toBeDisabled()

    fireEvent.change(depositInput, { target: { value: 500 }})
    expect(confirmBtn).not.toBeDisabled()
    fireEvent.click(confirmBtn)
    await wait()

    expect(mockBlkDepositFunction).toHaveBeenCalledWith({ coinbase: ActiveRelayer.coinbase }, { value: blk.toWei(500) })
    expect(http.updateRelayer).not.toHaveBeenCalled()
    R.getByText(/fake error/i)

    expect(confirmBtn).not.toBeDisabled()
    fireEvent.click(confirmBtn)
    await wait()

    expect(http.updateRelayer).toHaveBeenCalledWith({ deposit: 1500, id: ActiveRelayer.id })
    R.getByText(/new deposit has been made/i)
  })


})
