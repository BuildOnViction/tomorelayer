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
import MethodBody from './MethodBody'
import MethodSelect from './MethodSelect'

const mapProps = store => store.authStore

const actions = () => ({
  changeMethod: (state, method) => ({
    authStore: {
      ...state.authStore,
      method,
    }
  }),
  setUserAddress: (state, userAddress) => ({
    authStore: {
      ...state.authStore,
      userAddress: userAddress,
      auth: true,
    }
  })
})

class Authentication extends React.Component {
  state = {
    qrcode: '',
    hdPath: '',
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
    const { method: currentMethod, ledgerHdPath } = this.props
    const { TomoWallet, LedgerWallet, TrezorWallet, BrowserWallet } = UNLOCK_WALLET_METHODS

    const unlockByMethod = match({
      [TomoWallet]: void 0,
      [LedgerWallet]: async () => {
        const wallet = await ledger.open({ customDerivationPath: ledgerHdPath })
      },
      [TrezorWallet]: void 0,
      [BrowserWallet]: async () => {
        const available = await metamask.detect()
        when(!available).do(console.warn)('MetaMask not found!')
        when(available).do(async () => {
          const wallet = await metamask.open()
          console.warn('Your address: ' + wallet.address)
          this.props.setUserAddress(wallet.address)
        })()
      },
    })

    return unlockByMethod(currentMethod)
  }

  render () {
    const { method, changeMethod } = this.props
    const { qrcode } = this.state
    return (
      <React.Fragment>
        <TopBar />
        <Container center className="auth-container">
          <Header />
          <MethodSelect method={method} changeMethod={changeMethod} />
          <div className="col-md-12 method-body">
            <MethodBody method={method} qrcode={qrcode} unlock={this.unlockWallet} />
          </div>
        </Container>
      </React.Fragment>
    )
  }
}

export default connect(mapProps, actions)(Authentication)
