import React from 'react'
import { withRouter } from 'react-router-dom'
import { ethers } from 'ethers'
import {
  Box,
  Button,
  Typography,
} from '@material-ui/core'
import * as blk from 'service/blockchain'


class BrowserWallet extends React.Component {
  wallet = undefined
   provider = undefined

  state = {
    address: undefined,
    balance: undefined,
    noMetamaskError: false,
  }

  async componentDidMount() {
    const isMetamaskAvailable = !!window.web3
    if (!isMetamaskAvailable) {
      this.setState({ noMetamaskError: true })
    }
  }

  requestMetamask = async () => {
    if (window.ethereum) {
      await window.ethereum.enable()
    }
    if (window.web3) {
      if (window.web3.currentProvider) {
        this.provider = window.web3.currentProvider
      } else {
        this.provider = window.web3
      }
    }

    const provider = new ethers.providers.Web3Provider(this.provider)

    const signer = provider.getSigner()
    const address = await signer.getAddress()
    const balance = await blk.getBalance(address)
    this.setState({
      address,
      balance,
    })
  }

  confirm = async () => {
    const provider = new ethers.providers.Web3Provider(this.provider)
    const signer = provider.getSigner()

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
