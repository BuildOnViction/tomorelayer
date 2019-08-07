import React from 'react'
import { withRouter } from 'react-router-dom'
import { ethers } from 'ethers'
import {
  Box,
  Button,
  Typography,
} from '@material-ui/core'
import metamask from '@vutr/purser-metamask'
import * as blk from 'service/blockchain'
import WalletSigner from 'service/wallet'


class BrowserWallet extends React.Component {
  wallet = undefined

  state = {
    address: undefined,
    balance: undefined,
    noMetamaskError: false,
  }

  async componentDidMount() {
    const isMetamaskAvailable = await metamask.detect().then(() => true).catch(() => false)
    if (!isMetamaskAvailable) {
      this.setState({ noMetamaskError: true })
    }
  }

  requestMetamask = async () => {
    this.wallet = await metamask.open()
    const address = this.wallet.address
    const balance = await blk.getBalance(address)
    this.setState({
      address,
      balance,
    })
  }

  confirm = async () => {
    const provider = new ethers.providers.Web3Provider(window.web3.currentProvider)
    const signer = new WalletSigner(this.wallet, provider, metamask.accountChangeHook)
    this.props.onConfirm(signer)
  }

  render() {

    const {
      address,
      balance,
      noMetamaskError,
    } = this.state

    if (noMetamaskError) {
      return (
        <Box display="flex" justifyContent="center">
          <Typography component="h3">
            Please install MetaMask and set network to <span className="text-alert">{process.env.REACT_APP_RPC}</span>
          </Typography>
        </Box>
      )
    }

    return (
      <Box display="flex" justifyContent="center">
        {!address && (
          <Box display="flex" justifyContent="center" flexDirection="column">
            <Button onClick={this.requestMetamask} variant="contained">
              Unlock Wallet
            </Button>
          </Box>
        )}
        {address && balance && (
          <Box display="flex" flexDirection="column" justifyContent="center">
            <Typography component="div">
              Address: {address}
            </Typography>
            <Typography component="div">
              Balance: {balance} TOMO
            </Typography>
            <Box display="flex" justifyContent="center" className="mt-2">
              <Button onClick={this.confirm} variant="contained">
                Use this wallet
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    )
  }
}

export default withRouter(BrowserWallet)
