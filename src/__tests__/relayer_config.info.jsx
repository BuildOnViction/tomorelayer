import React from 'react'
import { addDays, format as timeFormat, subMinutes } from 'date-fns'
import {
  render,
  fireEvent,
  cleanup,
  wait,
  waitForElement,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import 'jest-dom/extend-expect'
import { Provider, connect } from '@vutr/redux-zero/react'
import createStore from '@vutr/redux-zero'
import { initialState } from 'service/store'
import * as http from 'service/backend'
import FormInfo from 'component/route/Dashboard/ConfigForms/FormInfo'
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

describe('Test Relayer-Config Info Form', () => {

  afterEach(cleanup)

  it('Request update info for Active Relayer', async () => {

    const ActiveRelayer = {
      id: 1,
      owner: Owner,
      name: 'MyActiveRelayer',
      link: 'http://dummyrelayer.dev',
      logo: 'http://dummy.dev/dummy.img',
    }

    const store = createStore({
      ...initialState,
      Relayers: [ActiveRelayer],
    })

    const ParentComponent = connect(
      state => ({ relayers: state.Relayers })
    )(({ relayers }) => (
      <div>
        <Alert />
        <FormInfo relayer={relayers.find(r => r.id === ActiveRelayer.id)} />
      </div>
    ))

    const R = render(
      <Provider store={store}>
        <ParentComponent />
      </Provider>
    )

    const nameInput = R.getByDisplayValue(new RegExp(ActiveRelayer.name), 'i')
    const linkInput = R.getByDisplayValue(new RegExp(ActiveRelayer.link), 'i')
    const logoInput = R.getByDisplayValue(new RegExp(ActiveRelayer.logo), 'i')
    const saveBtn = R.getByTestId(/save-button/i)
    R.getByAltText(new RegExp(ActiveRelayer.name), 'i')

    // Test error validation
    fireEvent.change(nameInput, { target: { value: 'ab' }})
    fireEvent.click(saveBtn)
    await wait()

    R.getByText('invalid name length')

    fireEvent.change(linkInput, { target: { value: 'ab' }})
    fireEvent.click(saveBtn)
    await wait()

    R.getByText('invalid link url')

    fireEvent.change(logoInput, { target: { value: 'ab' }})
    fireEvent.click(saveBtn)
    await wait()

    R.getByText('invalid logo url')

    // Change to valid values and save it
    // Test backennd throw error because relayer-name is not unique
    http.updateRelayer = jest.fn().mockResolvedValue({ error: 'name collision' })

    fireEvent.change(nameInput, { target: { value: 'abc' }})
    fireEvent.change(linkInput, { target: { value: 'http://abc.abc' }})
    fireEvent.change(logoInput, { target: { value: 'http://abc.abc/abc.img' }})

    fireEvent.click(saveBtn)
    await wait()

    expect(R.getByText(/name collision/i)).toBeInTheDocument()
    expect(R.queryByText(/invalid logo url/i)).toBeNull()
    expect(http.updateRelayer).toHaveBeenCalledWith({
      id: ActiveRelayer.id,
      name: 'abc',
      link: 'http://abc.abc',
      logo: 'http://abc.abc/abc.img',
    })

    fireEvent.change(nameInput, { target: { value: 'abcd' }})
    http.updateRelayer = jest.fn().mockResolvedValue({ ...ActiveRelayer, name: 'abcd' })

    fireEvent.click(saveBtn)
    await wait()

    expect(R.getByText(/relayer info updated/i)).toBeInTheDocument()

  })


  it('Request update info for ResigningRelayer', async () => {

    const ActiveRelayer = {
      id: 1,
      owner: Owner,
      name: 'MyActiveRelayer',
      link: 'http://dummyrelayer.dev',
      logo: 'http://dummy.dev/dummy.img',
      resigning: true,
    }

    const store = createStore({
      ...initialState,
      Relayers: [ActiveRelayer],
    })

    const ParentComponent = connect(
      state => ({ relayers: state.Relayers })
    )(({ relayers }) => (
      <div>
        <Alert />
        <FormInfo relayer={relayers.find(r => r.id === ActiveRelayer.id)} />
      </div>
    ))

    const R = render(
      <Provider store={store}>
        <ParentComponent />
      </Provider>
    )

    const nameInput = R.getByDisplayValue(new RegExp(ActiveRelayer.name), 'i')
    const linkInput = R.getByDisplayValue(new RegExp(ActiveRelayer.link), 'i')
    const logoInput = R.getByDisplayValue(new RegExp(ActiveRelayer.logo), 'i')
    const saveBtn = R.getByTestId(/save-button/i)
    R.getByAltText(new RegExp(ActiveRelayer.name), 'i')

    expect(nameInput).toBeDisabled()
    expect(linkInput).toBeDisabled()
    expect(logoInput).toBeDisabled()
    expect(saveBtn).toBeDisabled()
  })


})
