import React from 'react'
import ledger from '@vutr/purser-ledger'
import metamask from '@colony/purser-metamask'
import { connect } from 'redux-zero/react'
import { API, UNLOCK_WALLET_METHODS } from 'service/constant'
import { Client } from 'service/action'
import * as _ from 'service/helper'
import { Container } from 'component/utility'
import TopBar from './TopBar'
import Header from './Header'
import MethodSelect from './MethodSelect'
import MethodBody from './MethodBody'
import ModalWalletAddressList from './ModalWalletAddressList'
import spinner from 'asset/spinner.svg'

const mapProps = store => ({
  authState: store.authStore,
})

const actions = () => ({
  updateAuthState: (state, authStore) => ({
    ...state,
    authStore,
  })
})

class Authentication extends React.Component {
  state = {
    qrcode: '',
    walletAddresses: [],
    toggleModal: false,
    showSpinner: false,
  }

  async componentDidMount() {
    const isAndroid = navigator.userAgent.match(/Android/i)
    const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i)
    const agentQuery = (isAndroid || isIOS) ? 'mobile' : 'desktop'
    const data = await Client.get(API.fetchQRCode + agentQuery)
    this.setState({ qrcode: data.payload.qrcode })
  }

  unlockWallet = e => {
    e.preventDefault()
    const { when, match } = _
    const { authState, updateAuthState } = this.props
    const { TomoWallet, LedgerWallet, TrezorWallet, BrowserWallet } = UNLOCK_WALLET_METHODS

    const unlockByMethod = match({
      [TomoWallet]: void 0,
      [LedgerWallet]: async () => {
        // TODO: handle error (time out, cant open, wrong HD path)
        const wallet = await ledger.open({ customDerivationPath: authState.ledgerHdPath })
        updateAuthState({ ...authState, wallet })
        this.setState({
          walletAddresses: wallet.otherAddresses,
          toggleModal: true,
        })
      },
      [TrezorWallet]: void 0,
      [BrowserWallet]: async () => {
        const available = await metamask.detect()
        when(!available).do(console.warn)('MetaMask not found!')
        when(available).do(async () => {
          const wallet = await metamask.open()
          console.warn('Your address: ' + wallet.address)
          updateAuthState({ ...authState, wallet })
        })()
      },
    })

    return unlockByMethod(authState.method)
  }

  closeModal = (address = '') => () => this.setState(
    {
      toggleModal: false,
      showSpinner: address !== '',
    },
    () => !_.isEmpty(address) && setTimeout(async () => {
      const { authState, updateAuthState } = this.props

      if (authState.wallet) {
        // NOTE: case of Hardware Wallet
        const currentAddressIndex = authState.wallet.otherAddresses.indexOf(address)
        await authState.wallet.setDefaultAddress(currentAddressIndex)
        updateAuthState({ ...authState, userAddress: address, auth: true })
      }
    }, 2000)
  )

  render () {
    const { authState, updateAuthState } = this.props
    const {
      qrcode,
      walletAddresses,
      toggleModal,
      showSpinner,
    } = this.state
    const changeMethod = method => updateAuthState({ ...authState, method })
    return (
      <React.Fragment>
        <TopBar />
        <Container center className="auth-container">
          <Header />
          <MethodSelect method={authState.method} changeMethod={changeMethod} />
          <div className="col-md-12 method-body">
            <MethodBody method={authState.method} qrcode={qrcode} unlock={this.unlockWallet} />
            {showSpinner && (
               <img
                 alt="loading"
                 src={spinner}
                 width="80"
                 className="m-4"
               />
            )}
          </div>
        </Container>
        <ModalWalletAddressList
          addresses={walletAddresses}
          closeModal={this.closeModal}
          isOpen={toggleModal}
        />
      </React.Fragment>
    )
  }
}

export default connect(mapProps, actions)(Authentication)
