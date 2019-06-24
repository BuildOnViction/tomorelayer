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
      <Box display="flex" justifyContent="center">
        {!trezorWallet && (
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

        {trezorWallet && (
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
      </Box>
    )
  }
}
