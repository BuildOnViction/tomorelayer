import React from 'react'
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core'
import ledger from '@vutr/purser-ledger'
import * as blk from 'service/blockchain'


export default class LedgerWallet extends React.Component {

  state = {
    hdpath: "m/44'/889'/0'/0",
    openDialog: false,
    activeAddress: undefined,
    activeBalance: undefined,
    ledgerWallet: undefined,
  }

  changePath = e => this.setState({
    hdpath: e.target.value,
  })

  unlock = async () => {
    const ledgerWallet = await ledger.open()
    const activeAddress = ledgerWallet.address
    const activeBalance = await blk.getBalance(activeAddress)
    this.setState({
      activeAddress,
      activeBalance,
      ledgerWallet,
      openDialog: true,
    })
  }

  useAddress = () => this.setState({
    openDialog: false,
  })

  changeAddress = () => this.setState({
    openDialog: true,
  })

  cancel = () => this.setState({
    openDialog: false,
  })

  setDefaultAddress = async e => {
    const ledgerWallet = this.state.ledgerWallet
    const activeAddress = e.target.value
    const activeBalance = await blk.getBalance(activeAddress)
    const index = ledgerWallet.otherAddresses.indexOf(activeAddress)
    await ledgerWallet.setDefaultAddress(index)
    this.setState({
      activeAddress,
      activeBalance,
    })
  }

  confirm = () => this.props.onConfirm(this.state.ledgerWallet)

  render() {

    const {
      activeAddress,
      activeBalance,
      hdpath,
      ledgerWallet,
      openDialog,
    } = this.state

    return (
      <Container maxWidth="sm">
        {!ledgerWallet && (
          <Grid container alignItems="center" justify="center" direction="column" spacing={4}>
            <Grid item container justify="center">
              <TextField
                label="Select HD path to unlock your address"
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

        {ledgerWallet && (
          <Grid container alignItems="flex-end" justify="center">
            <Grid item container direction="column">
              <Typography component="div">
                Address: {activeAddress}
              </Typography>
              <Typography component="div">
                Balance: {activeBalance} TOMO
              </Typography>
            </Grid>
            <Grid item container sm={12}>
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
          <DialogTitle id="alert-dialog-title">
            Select address to use
          </DialogTitle>
          <DialogContent>
            <RadioGroup
              aria-label="wallet-addresses"
              name="wallet-addresses"
              value={activeAddress}
              onChange={this.setDefaultAddress}
            >
              {ledgerWallet && ledgerWallet.otherAddresses.map(r => (
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
