import React from 'react'
import { addDays, format as timeFormat, subMinutes } from 'date-fns'
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
import FormResign from 'component/route/Dashboard/ConfigForms/FormResign'
import Alert from 'component/shared/Alert'
import * as http from 'service/backend'


global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  }
})

const Owner = '0x21022a96AA9c06B0e2B021FC7D92E8Cab94BF390'
const activeRelayerCoinbase = '0x747681f8C8828bbec0FE8ec960827d846C6e7346'


describe('Test Relayer-Config Resign Form', () => {

  afterEach(cleanup)

  it('Request resign for Active Relayer', async () => {

    const ActiveRelayer = {
      id: 1,
      owner: Owner,
      coinbase: activeRelayerCoinbase,
      name: 'MyActiveRelayer',
      resigning: false,
      lock_time: null,
    }

    const simulatedLockTime = timeFormat(addDays(Date.now(), 28), 'X')

    const mockResignFunction = jest.fn()
                                   .mockResolvedValueOnce({ status: false, details: 'fake error' })
                                   .mockResolvedValueOnce({ status: true })

    http.updateRelayer = jest.fn().mockResolvedValue({
      ...ActiveRelayer,
      lock_time: simulatedLockTime,
      resigning: true,
    })

    const store = createStore({
      ...initialState,
      Relayers: [ActiveRelayer],
      blk: {
        RelayerContract: {
          resign: mockResignFunction
        }
      }
    })

    const ParentComponent = connect(
      state => ({ relayers: state.Relayers })
    )(({ relayers }) => (
      <div>
        <Alert />
        <FormResign relayer={relayers.find(r => r.id === ActiveRelayer.id)} />
      </div>
    ))

    const R = render(
      <Provider store={store}>
        <ParentComponent />
      </Provider>
    )

    const acknowledgeButton = R.getByText(/i understand/i)
    // Resign-Button should not be presented yet!
    expect(R.queryByTestId(/resign-button/i)).toBeNull()

    fireEvent.click(acknowledgeButton)
    await wait()

    // Show the current name and coinbase for the sake of clarity
    const resignButton = R.getByTestId(/resign-button/i)
    R.getByText(new RegExp(ActiveRelayer.coinbase), 'i')
    R.getByText(new RegExp(ActiveRelayer.name), 'i')
    // Accept-Button should not be presented yet!
    expect(R.queryByTestId(/accept-button/i)).toBeNull()

    fireEvent.click(resignButton)
    await wait()

    // Confirm-dialog pops up!
    R.getByText(/warning/i)
    const acceptButton = R.getByTestId(/accept-button/i)

    fireEvent.click(acceptButton)
    await wait()

    // ResignRequest called, blockchain error, alert
    expect(mockResignFunction).toHaveBeenCalledWith({ coinbase: ActiveRelayer.coinbase })
    R.getByText(/fake error/i)

    // Retry and success
    fireEvent.click(resignButton)
    await wait()

    // Confirm-dialog pops up!
    R.getByText(/warning/i)
    fireEvent.click(acceptButton)
    await wait()

    // ResignRequest called
    expect(mockResignFunction).toHaveBeenCalledWith({ coinbase: ActiveRelayer.coinbase })
    expect(http.updateRelayer).toHaveBeenCalledWith({
      ...ActiveRelayer,
      resigning: true,
      lock_time: timeFormat(addDays(Date.now(), 28), 'X'),
    })

    // Refund Info Component
    R.getByText(/relayer is resigning/i)
    R.getByText(/28 days remaining/i)
    const refundButton = R.getByTestId(/refund-button/i)
    expect(refundButton).toBeDisabled()
  })


  it('Request refund for relayer', async () => {

    const ResigningRelayer = {
      id: 1,
      owner: Owner,
      coinbase: activeRelayerCoinbase,
      name: 'MyRelayer',
      resigning: true,
      lock_time: timeFormat(subMinutes(Date.now(), 10), 'X'),
    }

    const mockResignFunction = jest.fn()
                                   .mockResolvedValueOnce({ status: false, details: 'fake error' })
                                   .mockResolvedValueOnce({ status: true })

    http.deleteRelayer = jest.fn().mockResolvedValue({})

    const store = createStore({
      ...initialState,
      Relayers: [ResigningRelayer],
      blk: {
        RelayerContract: {
          refund: mockResignFunction
        }
      }
    })

    const ParentComponent = connect(
      state => ({ relayers: state.Relayers })
    )(({ relayers }) => (
      <div>
        <Alert />
        <FormResign relayer={relayers.find(r => r.id === ResigningRelayer.id)} />
      </div>
    ))

    const R = render(
      <Provider store={store}>
        <ParentComponent />
      </Provider>
    )

    const refundButton = R.getByTestId(/refund-button/i)
    expect(refundButton).not.toBeDisabled()

    fireEvent.click(refundButton)
    await wait()

    expect(mockResignFunction).toHaveBeenCalledWith({ coinbase: ResigningRelayer.coinbase })
    expect(http.deleteRelayer).not.toHaveBeenCalled()
    R.getByText(/fake error/i)

    // Retry and success
    fireEvent.click(refundButton)
    await wait()

    expect(http.deleteRelayer).toHaveBeenCalledWith(ResigningRelayer.id)

  })

})
