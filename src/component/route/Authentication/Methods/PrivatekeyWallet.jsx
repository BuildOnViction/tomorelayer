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
import {
  getBalance,
} from 'service/blockchain'


export default class SoftwareWallet extends React.Component {

  state = {
    secret: '',
    wallet: undefined,
    balance: undefined,
    errorAlert: undefined,
  }

  changeSecret = e => this.setState({ secret: e.target.value })

  changeAddress = () => this.setState({
    secret: '',
    wallet: undefined,
    balance: undefined,
  })

  importWallet = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC)
    let wallet = {}

    try {
      wallet = new WalletSigner(this.state.secret, provider)
    } catch (e) {
      const errorAlert = 'invalid private key'
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
          <Box display="flex" flexDirection="column" justifyContent="center">
            <TextField
              label="Enter your private key"
              value={this.state.secret}
              onChange={this.changeSecret}
              type="password"
              error={Boolean(errorAlert)}
              helperText={errorAlert && <i className="text-alert">{errorAlert}</i>}
              variant="outlined"
              className="mb-1"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <KeyIcon />
                  </InputAdornment>
                )
              }}
            />
          </Box>
          <Box justifyContent="center" display="flex" className="mt-2">
            <Button onClick={this.importWallet} variant="contained">
              Import
            </Button>
          </Box>
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
            <Button onClick={this.changeAddress} variant="contained" size="small" className="m-1">
              Change Address
            </Button>
            <Button onClick={this.confirm} variant="contained" size="small" className="m-1">
              Confirm
            </Button>
          </Box>
        </Box>
      </Container>
    )
  }
}
