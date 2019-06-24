import React from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

  changePath = e => this.setState({ hdpath: e.target.value })

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

  useAddress = () => this.setState({ openDialog: false })

  changeAddress = () => this.setState({ openDialog: true })

  cancel = () => this.setState({ openDialog: false })

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
      hdpath,
      openDialog,
      ledgerWallet,
      activeAddress,
      activeBalance,
    } = this.state

    return (
      <Box display="flex" justifyContent="center">
        {!ledgerWallet && (
          <Box display="flex" justifyContent="space-between" alignItems="end">
            <TextField
              label="Select HD path"
              value={hdpath}
              onChange={this.changePath}
            />
            <Button onClick={this.unlock} variant="outlined">
              Connect
            </Button>
          </Box>
        )}

        {ledgerWallet && (
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" flexDirection="column" className="p-1">
              <Typography component="div">
                Address: {activeAddress}
              </Typography>
              <Typography component="div">
                Balance: {activeBalance} TOMO
              </Typography>
            </Box>
            <Box display="flex" flexDirection="row" justifyContent="space-between">
              <Button onClick={this.changeAddress} variant="outlined">
                Change Address
              </Button>
              <Button onClick={this.confirm} variant="outlined">
                Confirm
              </Button>
            </Box>
          </Box>
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
      </Box>
    )
  }
}
