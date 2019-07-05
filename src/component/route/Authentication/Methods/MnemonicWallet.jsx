import React from 'react'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@material-ui/core'
import { ethers, Wallet as WalletSigner } from 'ethers'
import * as blk from 'service/blockchain'


const DEFAULT_HD_PATH = "m/44'/889'/0'/0"

export default class SoftwareWallet extends React.Component {

  state = {
    secret: '',
    derivationPath: DEFAULT_HD_PATH,
    wallet: undefined,
    balance: undefined,
    errorAlert: undefined,
  }

  changeSecret = e => this.setState({ secret: e.target.value })

  changeDerivationPath = e => this.setState({ derivationPath: e.target.value })

  changeAddress = () => this.setState({
    wallet: undefined,
    balance: undefined,
    secret: '',
    derivationPath: DEFAULT_HD_PATH,
    errorAlert: undefined,
  })

  importWallet = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC)
    let wallet = {}

    try {
      wallet = WalletSigner.fromMnemonic(this.state.secret, this.state.derivationPath).connect(provider)
    } catch (e) {
      return this.setState({ errorAlert: 'invalid mnemonic / HD derivation path' })
    }

    const balance = await blk.getBalance(wallet.address)
    this.setState({ wallet, balance })
  }

  confirm = async () => {
    this.props.onConfirm(this.state.wallet)
  }

  render() {

    const {
      balance,
      errorAlert,
      wallet,
    } = this.state

    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography component="h2">
            Unlock your wallet using your Mnemonic
          </Typography>
        </Box>

        {!wallet && (
          <React.Fragment>
            <Box display="flex" flexDirection="column" justifyContent="center">
              <TextField
                label="Enter your Mnemonic"
                value={this.state.secret}
                onChange={this.changeSecret}
                type="password"
                className="mb-1"
                error={Boolean(errorAlert)}
                fullWidth
              />
              <TextField
                label="Change derivationPath"
                value={this.state.derivationPath}
                onChange={this.changeDerivationPath}
                type="text"
                className="mb-1"
                error={Boolean(errorAlert)}
                helperText={errorAlert && <i className="text-alert">{errorAlert}</i>}
                fullWidth
              />
            </Box>
            <Box justifyContent="flex-end" display="flex" className="mt-2">
              <Button onClick={this.importWallet} variant="contained">
                Import
              </Button>
            </Box>
          </React.Fragment>
        )}

        {wallet && (
          <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection="column">
            <Box display="flex" flexDirection="column" className="p-1">
              <Typography component="div">
                Address: {wallet.address}
              </Typography>
              <Typography component="div">
                Balance: {balance} TOMO
              </Typography>
            </Box>
            <Box display="flex" justifyContent="center">
              <Button onClick={this.changeAddress} variant="contained" size="small" className="m-1">
                Change Address
              </Button>
              <Button onClick={this.confirm} variant="contained" size="small" className="m-1">
                Confirm
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    )
  }
}
