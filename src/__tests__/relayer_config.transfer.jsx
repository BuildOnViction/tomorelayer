import React from 'react'
import { HashRouter } from 'react-router-dom'
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

    const DummyRelayer = {
      id: 2,
      owner: '0x070aA7AD03B89B3278f19d34F119DD3C2a244675',
      coinbase: '0x9e9d3d79e9f73806999e0ca601f23b701b97bc46',
    }

    const mockTransferFunction = jest.fn()
                                   .mockResolvedValueOnce({ status: false, details: 'fake error' })
                                   .mockResolvedValueOnce({ status: true })

    const store = createStore({
      ...initialState,
      Relayers: [ActiveRelayer, DummyRelayer],
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
    const coinbaseInput = R.getByDisplayValue(new RegExp(ActiveRelayer.coinbase), 'i')
    const ownerInput = R.getByDisplayValue(new RegExp(ActiveRelayer.owner), 'i')
    // Transfer-Button will be disabled until
    // new owner address got input and different from current owner
    expect(transferButton).toBeDisabled()
    // Accept-Button should not be presented yet!
    expect(R.queryByTestId(/accept-button/i)).toBeNull()


    // NOTE: testing different scenarios of foul values
    // Owner/Coinbase not a valid address
    fireEvent.change(ownerInput, { target: { value: 'invalid-owner' }})
    fireEvent.change(coinbaseInput, { target: { value: 'invalid-coinbase' }})
    expect(transferButton).not.toBeDisabled()
    fireEvent.click(transferButton)
    await wait()

    R.getByText(/warning/i)
    const acceptButton = R.getByTestId(/accept-button/i)
    fireEvent.click(acceptButton)
    await wait()
    R.getAllByText(/invalid address/i)
    // Coinbase === Owner
    let foulTestValue = '0x579798b0bf809e9b4a5e554d16011db04a6af340'
    fireEvent.change(ownerInput, { target: { value: foulTestValue }})
    fireEvent.change(coinbaseInput, { target: { value: foulTestValue }})
    fireEvent.click(transferButton)
    await wait()
    fireEvent.click(R.getByTestId(/accept-button/i))
    await wait()
    R.getAllByText(/coinbase cannot be the same as owner address/i)
    // New Coinbase is already used for another relayer
    foulTestValue = DummyRelayer.coinbase
    fireEvent.change(coinbaseInput, { target: { value: foulTestValue }})
    fireEvent.click(transferButton)
    await wait()
    fireEvent.click(R.getByTestId(/accept-button/i))
    await wait()
    R.getByText(/invalid coinbase/i)
    // New coinbase is already a Relayer-owner address
    foulTestValue = DummyRelayer.owner
    fireEvent.change(coinbaseInput, { target: { value: foulTestValue }})
    fireEvent.click(transferButton)
    await wait()
    fireEvent.click(R.getByTestId(/accept-button/i))
    await wait()
    R.getByText(/invalid coinbase/i)
    // New owner is a coinbase of another relayer
    foulTestValue = DummyRelayer.coinbase
    fireEvent.change(ownerInput, { target: { value: foulTestValue }})
    fireEvent.click(transferButton)
    await wait()
    fireEvent.click(R.getByTestId(/accept-button/i))
    await wait()
    R.getByText(/invalid owner address/i)
    // End scenario test


    fireEvent.change(coinbaseInput, { target: { value: ActiveRelayer.coinbase }})
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
