import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import { Container } from 'component/utility'
import { UNLOCK_WALLET_METHODS } from 'service/constant'
import TopBar from './TopBar'
import Header from './Header'
import MethodSelect from './MethodSelect'
import TomoWalletMethod from './Methods/TomoWallet'
import LedgerWalletMethod from './Methods/LedgerWallet'
import TrezorWalletMethod from './Methods/TrezorWallet'
import BrowserWalletMethod from './Methods/BrowserWallet'
import AddressModal from './AddressModal'
import { $getQRCode } from './actions'

const { TomoWallet, LedgerWallet, TrezorWallet, BrowserWallet } = UNLOCK_WALLET_METHODS

class Authentication extends React.Component {
  componentDidMount() {
    this.props.$getQRCode()
  }

  componentDidUpdate() {
    if (this.props.auth) {
      this.props.history.push('/')
    }
  }

  render () {
    const method = this.props.method
    return (
      <React.Fragment>
        <TopBar />
        <Container center className="auth-container">
          <Header />
          <MethodSelect  />
          <div className="col-md-12 method-body">
            {method === TomoWallet && <TomoWalletMethod />}
            {method === LedgerWallet && <LedgerWalletMethod />}
            {method === TrezorWallet && <TrezorWalletMethod />}
            {method === BrowserWallet && <BrowserWalletMethod />}
          </div>
        </Container>
        <AddressModal />
      </React.Fragment>
    )
  }
}

const mapProps = state => ({
  method: state.authStore.method,
  auth: state.authStore.auth,
})

const actions = store => ({
  $getQRCode: $getQRCode(store),
})

export default connect(mapProps, actions)(withRouter(Authentication))
