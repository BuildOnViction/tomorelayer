import React from 'react'
import { HashRouter } from 'react-router-dom'
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
import FormTransfer from 'component/route/Dashboard/ConfigForms/FormTransfer'
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
const NewOwner = '0xdD596FfB7f7A6123C36ecEf2F8a48AfEc6D7B889'
const testCoinbase = '0x747681f8C8828bbec0FE8ec960827d846C6e7346'


describe('Test Relayer-Config Transfer Form', () => {

  afterEach(cleanup)

  it('Request transfer for Active Relayer', async () => {

    const ActiveRelayer = {
      id: 1,
      owner: Owner,
      coinbase: testCoinbase
    }

    const mockTransferFunction = jest.fn()
                                   .mockResolvedValueOnce({ status: false, details: 'fake error' })
                                   .mockResolvedValueOnce({ status: true })

    const store = createStore({
      ...initialState,
      Relayers: [ActiveRelayer],
      blk: {
        RelayerContract: {
          transfer: mockTransferFunction
        }
      }
    })

    const ParentComponent = connect(
      state => ({ relayers: state.Relayers })
    )(({ relayers }) => (
      <div>
        <Alert />
        <FormTransfer relayer={relayers.find(r => r.id === ActiveRelayer.id)} />
      </div>
    ))

    const R = render(
      <Provider store={store}>
        <HashRouter>
          <ParentComponent />
        </HashRouter>
      </Provider>
    )

    const acknowledgeButton = R.getByText(/i understand/i)
    // Transfer-Button should not be presented yet!
    expect(R.queryByTestId(/transfer-button/i)).toBeNull()

    fireEvent.click(acknowledgeButton)
    await wait()

    // Show the current owner and coinbase for the sake of clarity
    const transferButton = R.getByTestId(/transfer-button/i)
    R.getByDisplayValue(new RegExp(ActiveRelayer.coinbase), 'i')
    const ownerInput = R.getByDisplayValue(new RegExp(ActiveRelayer.owner), 'i')
    // Transfer-Button will be disabled until
    // new owner address got input and different from current owner
    expect(transferButton).toBeDisabled()
    // Accept-Button should not be presented yet!
    expect(R.queryByTestId(/accept-button/i)).toBeNull()

    // Test input an invalid address
    fireEvent.change(ownerInput, { target: { value: 'invalid-coinbase' }})
    expect(transferButton).not.toBeDisabled()
    fireEvent.click(transferButton)
    await wait()

    // Confirm-dialog pops up!
    R.getByText(/warning/i)
    const acceptButton = R.getByTestId(/accept-button/i)
    fireEvent.click(acceptButton)
    await wait()
    R.getByText(/invalid address/i)


    fireEvent.change(ownerInput, { target: { value: NewOwner }})
    expect(transferButton).not.toBeDisabled()

    fireEvent.click(transferButton)
    await wait()

    R.getByText(/warning/i)
    // Mocking backend
    http.updateRelayer = jest.fn().mockResolvedValue({})

    fireEvent.click(acceptButton)
    await wait()

    expect(mockTransferFunction).toHaveBeenCalledWith({
      currentCoinbase: testCoinbase,
      owner: NewOwner,
      coinbase: testCoinbase,
    })

    // Some blockchain error thrown, alert it!
    expect(http.updateRelayer).not.toHaveBeenCalled()
    R.getByText(/fake error/i)

    expect(transferButton).not.toBeDisabled()
    fireEvent.click(transferButton)
    await wait()

    fireEvent.click(R.getByTestId(/accept-button/i))
    await wait()

    // Transfer succeeded alert
    expect(http.updateRelayer).toHaveBeenCalledWith({
      id: ActiveRelayer.id,
      owner: NewOwner,
      coinbase: testCoinbase,
    })
    R.getByText(/relayer transfered/i)

  })


  it('Request tranfer for ResigningRelayer', async () => {

    const ActiveRelayer = {
      id: 1,
      owner: Owner,
      coinbase: testCoinbase,
      resigning: true,
    }

    const mockTransferFunction = jest.fn()

    const store = createStore({
      ...initialState,
      Relayers: [ActiveRelayer],
      blk: {
        RelayerContract: {
          transfer: mockTransferFunction
        }
      }
    })

    const ParentComponent = connect(
      state => ({ relayers: state.Relayers })
    )(({ relayers }) => (
      <div>
        <Alert />
        <FormTransfer relayer={relayers.find(r => r.id === ActiveRelayer.id)} />
      </div>
    ))

    const R = render(
      <Provider store={store}>
        <HashRouter>
          <ParentComponent />
        </HashRouter>
      </Provider>
    )


    R.getByText(/not allowed/i)

  })


})
