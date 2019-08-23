import React from 'react'
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core'
import trezor from '@vutr/purser-trezor'
import {
  getBalance,
} from 'service/blockchain'
import { ethers } from 'ethers'
import WalletSigner from 'service/wallet'


export default class TrezorWallet extends React.Component {

  state = {
    hdpath: "m/44'/60'/0'/0",
    openDialog: false,
    activeAddress: undefined,
    activeBalance: undefined,
    trezorWallet: undefined,
  }

  changePath = e => this.setState({ hdpath: e.target.value })

  unlock = async () => {
    const trezorWallet = await trezor.open()
    const activeAddress = trezorWallet.address
    const activeBalance = await getBalance(activeAddress)
    const openDialog = true

    this.setState({
      activeAddress,
      activeBalance,
      openDialog,
      trezorWallet,
    })
  }

  useAddress = () => this.setState({ openDialog: false })

  changeAddress = () => this.setState({ openDialog: true })

  cancel = () => this.setState({ openDialog: false })

  setDefaultAddress = async e => {
    const trezorWallet = this.state.trezorWallet
    const activeAddress = e.target.value
    const activeBalance = await getBalance(activeAddress)
    const index = trezorWallet.otherAddresses.indexOf(activeAddress)

    await trezorWallet.setDefaultAddress(index)

    this.setState({ activeAddress, activeBalance })
  }

  confirm = () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC)
    const signer = new WalletSigner(this.state.trezorWallet, provider, undefined, 'coldwallet')
    this.props.onConfirm(signer)
  }

  render() {

    const {
      activeAddress,
      activeBalance,
      openDialog,
      hdpath,
      trezorWallet,
    } = this.state

    return (
      <Container maxWidth="sm">
        {!trezorWallet && (
          <Grid container alignItems="center" justify="center" direction="column" spacing={4}>
            <Grid item container justify="center">
              <TextField
                label="Select HD path to unlock your wallet"
                value={hdpath}
                onChange={this.changePath}
                variant="outlined"
                disabled
                fullWidth
              />
            </Grid>
            <Grid item>
              <Button onClick={this.unlock} variant="contained">
                Connect
              </Button>
            </Grid>
          </Grid>
        )}

        {trezorWallet && (
          <Grid container alignItems="flex-end" justify="center">
            <Grid item>
              <Typography component="div">
                Address: {activeAddress}
              </Typography>
              <Typography component="div">
                Balance: {activeBalance} TOMO
              </Typography>
            </Grid>
            <Grid item container>
              <Grid item sm={6} md={12}>
                <Button onClick={this.changeAddress} variant="outlined">
                  Change Address
                </Button>
              </Grid>
              <Grid item sm={6} md={12}>
                <Button onClick={this.confirm} variant="outlined">
                  Confirm
                </Button>
              </Grid>
            </Grid>
          </Grid>
        )}

        <Dialog
          open={openDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Select address to use</DialogTitle>
          <DialogContent>
            <RadioGroup
              aria-label="wallet-addresses"
              name="wallet-addresses"
              value={activeAddress}
              onChange={this.setDefaultAddress}
            >
              {trezorWallet && trezorWallet.otherAddresses.map(r => (
                <FormControlLabel
                  key={r}
                  value={r}
                  control={<Radio />}
                  label={r}
                />
              ))}
            </RadioGroup>

          </DialogContent>
          <DialogActions>
            <Button onClick={this.useAddress} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    )
  }
}
