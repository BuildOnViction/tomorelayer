import React from 'react'
import {
  Box,
  Button,
  Container,
  Switch,
  TextField,
  Typography,
} from '@material-ui/core'
import { ethers, Wallet as WalletSigner } from 'ethers'
import * as blk from 'service/blockchain'


const SECRET_TYPE = {
  private_key: 'private key',
  mnemonic: 'mnemonic'
}

const DEFAULT_HD_PATH = "m/44'/889'/0'/0"

export default class SoftwareWallet extends React.Component {

  state = {
    using: SECRET_TYPE.private_key,
    secret: '',
    derivationPath: DEFAULT_HD_PATH,
    wallet: undefined,
    balance: undefined,
  }

  changeSecret = e => this.setState({ secret: e.target.value })

  changeAddress = () => this.setState({
    wallet: undefined,
    balance: undefined,
    secret: '',
    derivationPath: DEFAULT_HD_PATH,
  })

  importWallet = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC)
    let wallet = {}


    if (this.state.using === SECRET_TYPE.private_key) {
      try {
        wallet = new WalletSigner(this.state.secret, provider)
      } catch (e) {
        return this.setState({ errorAlert: 'invalid private key' })
      }
    } else {
      try {
        wallet = WalletSigner.fromMnemonic(this.state.secret, this.state.derivationPath).connect(provider)
      } catch (e) {
        return this.setState({ errorAlert: 'invalid mnemonic / HD derivation path' })
      }
    }

    const balance = await blk.getBalance(wallet.address)
    this.setState({ wallet, balance })
  }

  confirm = async () => {
    this.props.onConfirm(this.state.wallet)
  }

  changeForm = using => () => {
    const method = using === SECRET_TYPE.private_key ? SECRET_TYPE.mnemonic : SECRET_TYPE.private_key
    this.setState({ using: method })
  }

  renderPrivateKeyForm = () => {
    const { errorAlert } = this.state
    return (
      <TextField
        label="Enter your private key"
        value={this.state.secret}
        onChange={this.changeSecret}
        type="password"
        error={Boolean(errorAlert)}
        helperText={errorAlert && <i className="text-alert">{errorAlert}</i>}
        className="mb-1"
        fullWidth
      />
    )
  }

  renderMnemonicForm = () => {
    const { errorAlert } = this.state
    const changeDerivationPath = e => this.setState({ derivationPath: e.target.value })
    return (
      <React.Fragment>
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
          onChange={changeDerivationPath}
          type="text"
          className="mb-1"
          error={Boolean(errorAlert)}
          helperText={errorAlert && <i className="text-alert">{errorAlert}</i>}
          fullWidth
        />
      </React.Fragment>
    )
  }

  render() {

    const {
      using,
      wallet,
      balance,
    } = this.state

    return (
      <Container maxWidth="sm">
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography component="h2">
            Unlock your wallet using {using}
          </Typography>
          <Box className="pl-1">
            <Switch value={using} onChange={this.changeForm(using)} />
          </Box>
        </Box>

        {!wallet && (
          <React.Fragment>
            <Box display="flex" flexDirection="column" justifyContent="center">
              {using === SECRET_TYPE.private_key ? this.renderPrivateKeyForm() : this.renderMnemonicForm()}
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
