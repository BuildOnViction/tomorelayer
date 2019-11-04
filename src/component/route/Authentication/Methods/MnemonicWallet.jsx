import React from 'react'
import {
  Box,
  Button,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core'
import KeyIcon from '@material-ui/icons/VpnKey'
import {
  ethers,
  Wallet as WalletSigner,
} from 'ethers'
import { withStyles } from '@material-ui/styles'
import {
  getBalance,
} from 'service/blockchain'


const DEFAULT_HD_PATH = "m/44'/60'/0'/0/0"

const HdPathNote = withStyles({
  root: {
    marginTop: 5,
    fontSize: 12,
    color: '#7473a6',
    lineHeight: '18px',

    '& span': {
      cursor: 'pointer',
      color: '#cfcde1',

      '&:hover': {
        color: '#fff'
      }
    }
  }
})(Typography)

export default class SoftwareWallet extends React.Component {

  state = {
    secret: '',
    derivationPath: DEFAULT_HD_PATH,
    wallet: undefined,
    balance: undefined,
    errorAlert: undefined,
  }

  changeSecret = e => this.setState({
    secret: e.target.value,
    errorAlert: undefined,
  })

  changeDerivationPath = e => this.setState({
    derivationPath: e.target.value,
    errorAlert: undefined,
  })

  chooseDerivationPath = derivationPath => this.setState({ derivationPath })

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
      const {
        secret,
        derivationPath,
      } = this.state

      wallet = WalletSigner.fromMnemonic(secret, derivationPath).connect(provider)

    } catch (e) {
      const errorAlert = 'invalid mnemonic / HD derivation path'
      return this.setState({ errorAlert })
    }

    const balance = await getBalance(wallet.address)
    this.setState({ wallet, balance })
  }

  confirm = async () => this.props.onConfirm(this.state.wallet)

  render() {

    const {
      balance,
      errorAlert,
      wallet,
    } = this.state

    if (!wallet) {
      return (
        <Container maxWidth="sm">
          <React.Fragment>
            <Box display="flex" flexDirection="column" justifyContent="center">
              <TextField
                label="Enter your Mnemonic"
                value={this.state.secret}
                onChange={this.changeSecret}
                type="password"
                className="mb-1"
                error={Boolean(errorAlert)}
                variant="outlined"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <KeyIcon />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                label="Change derivationPath"
                value={this.state.derivationPath}
                onChange={this.changeDerivationPath}
                type="text"
                error={Boolean(errorAlert)}
                variant="outlined"
                fullWidth
              />
              <HdPathNote component="div">
                To unlock the wallet, try paths <span onClick={() => this.chooseDerivationPath("m/44'/60'/0'")}>m/44'/60'/0'</span> or <span onClick={() => this.chooseDerivationPath("m/44'/60'/0'/0")}>m/44'/60'/0'/0</span> or <span onClick={() => this.chooseDerivationPath("m/44'/889'/0'/0")}>m/44'/889'/0'/0</span>.
              </HdPathNote>
            </Box>
            <Box justifyContent="center" display="flex" className="mt-2">
              <Button onClick={this.importWallet} variant="contained">
                Import
              </Button>
            </Box>
          </React.Fragment>
        </Container>
      )
    }

    return (
      <Container maxWidth="sm">
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
            <Button onClick={this.changeAddress} variant="contained" className="m-1">
              Change Address
            </Button>
            <Button onClick={this.confirm} variant="contained" className="m-1">
              Confirm
            </Button>
          </Box>
        </Box>
      </Container>
    )
  }
}
