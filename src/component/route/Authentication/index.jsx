import React from 'react'
import ledger from '@vutr/purser-ledger'
import metamask from '@colony/purser-metamask'
import { connect } from 'redux-zero/react'
import { API, UNLOCK_WALLET_METHODS } from 'service/constant'
import { Client } from 'service/action'
import * as _ from 'service/helper'
import { Container } from 'component/utility'
import TopBar from './TopBar'
import MethodBody from './MethodBody'
import MethodSelect from './MethodSelect'
import logo from 'asset/relayer-logo.png'

const mapProps = store => ({
  method: store.authStore.method,
  userAddress: store.authStore.userAddress,
  auth: store.authStore.auth,
})

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

  componentDidUpdate(prevProps) {
    // Change Hd path on user input
  }

  unlockWallet = e => {
    e.preventDefault()
    const { when, match, safety_net } = _
    const currentMethod = this.props.method
    const { TomoWallet, LedgerWallet, TrezorWallet, BrowserWallet } = UNLOCK_WALLET_METHODS

    const unlockByMethod = match({
      [TomoWallet]: void 0,
      [LedgerWallet]: async () => {
        console.warn('Unlock Ledger Wallet')
        const [error, wallet] = safety_net(await ledger.open({ customDerivationPath: "m/44'/889'/0'/0" }))
        when(error).do(console.warn)('Somethign wrong wrong')
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
        <Container center>
          <img
            alt="logo"
            src={logo}
            className="relayer-logo block mb-3"
            height="80"
          />
          <div className="col-md-12">
            <div className="mb-2 mt-2 font-3 text-left">
              Start by choosing the wallet you would like to unlock
            </div>
            <MethodSelect
              method={method}
              changeMethod={changeMethod}
            />
          </div>
          <div className="col-md-12 method-body">
            <MethodBody method={method} qrcode={qrcode} />
          </div>
          <button onClick={this.unlockWallet} className="btn">
            Unlock my Wallet!
          </button>
        </Container>
      </React.Fragment>
    )
  }
}

export default connect(mapProps, actions)(Authentication)
