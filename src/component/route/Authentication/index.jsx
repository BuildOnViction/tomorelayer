import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import { Box } from '@material-ui/core'
import { UNLOCK_WALLET_METHODS, MISC } from 'service/constant'
import { compose } from 'service/helper'
import { getAuthenticated } from 'service/backend'
import {
  PushAlert,
  AlertVariant,
} from 'service/frontend'
import Header from './Header'
import MethodBar from './MethodBar'
import BrowserWallet from './Methods/BrowserWallet'
import LedgerWallet from './Methods/LedgerWallet'
import TrezorWallet from './Methods/TrezorWallet'
import PrivatekeyWallet from './Methods/PrivatekeyWallet'
import MnemonicWallet from './Methods/MnemonicWallet'


const {
  BrowserWallet: _BrowserWallet_,
  LedgerWallet: _LedgerWallet_,
  TrezorWallet: _TrezorWallet_,
  SoftwareWalletMnemonic: _MnemonicWallet_,
  SoftwareWalletPrivate: _PrivateWallet_,
} = UNLOCK_WALLET_METHODS


class Authentication extends React.Component {

  state = {
    unlockingMethod: 0,
    QRCodeLink: '',
  }

  MethodOptions = [
    _BrowserWallet_,
    _LedgerWallet_,
    _TrezorWallet_,
    _PrivateWallet_,
    _MnemonicWallet_,
  ]

  componentDidMount() {
    const isAndroid = window.navigator.userAgent.match(/Android/i)
    const isIOS = window.navigator.userAgent.match(/iPhone|iPad|iPod/i)
    const agentQuery = (isAndroid || isIOS) ? 'mobile' : 'desktop'
    if (agentQuery === 'mobile') {
      this.MethodOptions = this.MethodOptions.filter(r => ![
        UNLOCK_WALLET_METHODS.LedgerWallet,
        UNLOCK_WALLET_METHODS.TrezorWallet,
      ].includes(r))
    }
    // this.getQRCode()
  }

  changeMethod = (unlockingMethod) => this.setState({ unlockingMethod })

  confirmWallet = async wallet => {
    const address = await wallet.getAddress()
    const signed = await wallet.signMessage(MISC.AuthMessage)
    const { error } = await getAuthenticated(address, signed)

    if (error) {
      return this.props.PushAlert({
        variant: AlertVariant.error,
        message: `${error.message}: ${error.detail}`,
      })
    }

    this.props.saveWallet(wallet)
    const findFirstRelayer = this.props.relayers.find(r => r.owner === address)

    if (findFirstRelayer) {
      return setTimeout(() => {
        const path = `/dashboard/${findFirstRelayer.coinbase}`
        return this.props.history.push(path)
      })
    }

    return this.props.history.push('/register')

  }

  render () {

    const {
      unlockingMethod,
    } = this.state

    const isActiveMethod = (method) => unlockingMethod === this.MethodOptions.indexOf(method)

    return (
      <Box>
        <Header />
        <MethodBar value={unlockingMethod} onChange={this.changeMethod} options={this.MethodOptions}>
        </MethodBar>
        {isActiveMethod(_BrowserWallet_) && <BrowserWallet onConfirm={this.confirmWallet} />}
        {isActiveMethod(_LedgerWallet_) && <LedgerWallet onConfirm={this.confirmWallet} />}
        {isActiveMethod(_TrezorWallet_) && <TrezorWallet onConfirm={this.confirmWallet} />}
        {isActiveMethod(_PrivateWallet_) && <PrivatekeyWallet onConfirm={this.confirmWallet} />}
        {isActiveMethod(_MnemonicWallet_) && <MnemonicWallet onConfirm={this.confirmWallet} />}
      </Box>
    )
  }
}

const mapProps = state => ({
  socket: state.socket,
})

const actions = store => ({
  PushAlert,
  saveWallet: (state, wallet) => {
    const user = {
      ...state.user,
      wallet,
    }

    return {
      user,
    }
  },
})

export default compose(
  withRouter,
  connect(mapProps, actions),
)(Authentication)
