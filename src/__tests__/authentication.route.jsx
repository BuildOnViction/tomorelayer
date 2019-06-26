import React from 'react'
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from '@testing-library/react'
import 'jest-dom/extend-expect'
import { HashRouter } from 'react-router-dom'
import { Provider } from '@vutr/redux-zero/react'
import createStore from '@vutr/redux-zero'

import metamask from '@vutr/purser-metamask'
import ledger from '@vutr/purser-ledger'

import { MISC } from 'service/constant'
import Authentication from 'component/route/Authentication'

import * as blk from 'service/blockchain'
import * as _ from 'service/helper'
import { initialState } from 'service/store'

/**
 * Testing Actions for Register Flow
 * @test {RegisterComponent}
 * - Here we test all actions that will be used for registration flow
 * - all blockchain functions will be mocked
 * - yet, backend functions will all be tested through
 * - Registration form will be a Wizard Form, but some of its actions will be mutating state
 */


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

beforeAll(() => {
  const store = createStore(initialState)

  const renderUtils = render(
    <Provider store={store}>
      <HashRouter>
        <Authentication />
      </HashRouter>
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
})

afterAll(cleanup)

/**
 * this is test for Authentication Class
 * @test {Authentication}
 */
describe('Test Authentication & WalletUnlock Component', () => {

  /**
   * @test {TomoWallet}
   * proper render, with Header, Logo and TomoWallet as default methodBar
   * After unlock with TomoWallet, a new instance of Wallet & Balance shown properly
   */
  it('#TomoWallet: render properly with all Unlock Options', async () => {

    const header = getByText(/unlock your wallet/i)

    const TomoWallet_Select = getByText(/tomo wallet/i)
    const MetaMask_Select = getByText(/metamask/i)
    const Ledger_Select = getByText(/ledger wallet/i)
    const Trezor_Select = getByText(/trezor wallet/i)
    // const PrivateKey_Select = getByText(/privatekey/i)

    getByText(/scan qr code/i)

    /**
     * @todo testing unlock with phone
     */
  })


  /**
   * @test {BrowserWallet}
   * proper unlock with BrowserWallet/MetaMask/TrustWallet
   * After unlock with BrowserWallet, a new instance of Wallet & Balance shown properly
   */
  it('#BrowserWallet: render properly, unlock ok', async () => {

    const MetaMask_Select = getByText(/metamask/i)
    fireEvent.click(MetaMask_Select)

    const unlockBtn = await findByText(/unlock wallet/i)

    const spied = jest.spyOn(metamask, 'open')
    /**
     * NOTE: important - this is a TESTING ACCOUNT that contains 1 (one) TOMO
     */
    const testWalletAddress = '0x21022a96AA9c06B0e2B021FC7D92E8Cab94BF390'
    spied.mockResolvedValue({ address: testWalletAddress })

    fireEvent.click(unlockBtn)
    await findByText(new RegExp(testWalletAddress, 'i'))
    /**
     * Should print out the correct balance - roughly ~1 TOMO - precision may varies
     */
    getByText(/1\..+TOMO/i)
  })


  /**
   * @test {LedgerWallet}
   * proper unlock with LedgerWallet
   * After unlock with Ledger, new modal pops up show available addresses for user to select
   * After confirm, export  a new wallet isntance
   */
  it('#LedgerWallet: render properly, unlock ok', async () => {

    const LedgerWallet_Select = getByText(/ledger wallet/i)
    fireEvent.click(LedgerWallet_Select)

    await findByText(/hd path/i)
    getByDisplayValue("m/44'/889'/0'/0")
    const connnectBtn = getByText(/connect/i)

    /**
     * Mocking the addresses
     */
    const spied = jest.spyOn(ledger, 'open')
    const mock = Object.create({
      address: '0x1111111111111111111111111111111111111111',
      otherAddresses: [
        '0x1111111111111111111111111111111111111111',
        '0x2222222222222222222222222222222222222222',
        '0x3333333333333333333333333333333333333333',
        '0x4444444444444444444444444444444444444444',
      ],
      setDefaultAddress: function(idx) {
        return new Promise(resolve => {
          this.address = this.otherAddresses[idx]
          resolve()
        })
      },
    })
    spied.mockResolvedValue(mock)

    const spiedBlockchain = jest.spyOn(blk, 'getBalance')
    const mockBalances = ['12323456', '9999']
    spiedBlockchain.mockResolvedValue(mockBalances[0])

    /**
     * Unlock a Ledger Wallet
     * show all other addresses
     */
    fireEvent.click(connnectBtn)
    await wait(() => {
      mock.otherAddresses.forEach(addr => getByLabelText(addr))
      getByText(new RegExp(mockBalances[0], 'i'))
    })

    /**
     * Select the second address, print out the next balance value
     */
    spiedBlockchain.mockResolvedValue(mockBalances[1])
    const secondAddressInput = getByLabelText(mock.otherAddresses[1])
    fireEvent.click(secondAddressInput)
    await wait(() => {
      expect(secondAddressInput.checked).toBe(true)
    })

  })

  it('#TrezorWallet: works the same as Ledger', async () => {
    const Trezor_Select = getByText(/trezor wallet/i)
    fireEvent.click(Trezor_Select)

    await findByText(/connect/i)
    getByDisplayValue("m/44'/60'/0'/0")

  })

  it('#SoftwareWallet: private key, mnemonic', async () => {
    const Software_Select = getByText(/private key/i)
    fireEvent.click(Software_Select)

    await findByText(/import/i)
  })

})
