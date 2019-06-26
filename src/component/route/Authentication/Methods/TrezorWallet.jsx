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
import ledger from '@vutr/purser-ledger'
import * as blk from 'service/blockchain'


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
    const trezorWallet = await ledger.open()
    const activeAddress = trezorWallet.address
    const activeBalance = await blk.getBalance(activeAddress)
    this.setState({
      activeAddress,
      activeBalance,
      trezorWallet,
      openDialog: true,
    })
  }

  useAddress = () => this.setState({ openDialog: false })

  changeAddress = () => this.setState({ openDialog: true })

  cancel = () => this.setState({ openDialog: false })

  setDefaultAddress = async e => {
    const trezorWallet = this.state.trezorWallet
    const activeAddress = e.target.value
    const activeBalance = await blk.getBalance(activeAddress)
    const index = trezorWallet.otherAddresses.indexOf(activeAddress)
    await trezorWallet.setDefaultAddress(index)
    this.setState({
      activeAddress,
      activeBalance,
    })
  }

  confirm = () => this.props.onConfirm(this.state.trezorWallet)

  render() {

    const {
      hdpath,
      openDialog,
      trezorWallet,
      activeAddress,
      activeBalance,
    } = this.state

    return (
      <Container maxWidth="md">
        {!trezorWallet && (
          <Grid container alignItems="flex-end" justify="center">
            <Grid item sm={10} md={5} lg={4} className="pr-3 pl-3">
              <TextField
                label="Select HD path"
                value={hdpath}
                onChange={this.changePath}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item justify="center">
              <Button onClick={this.unlock} variant="outlined">
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
