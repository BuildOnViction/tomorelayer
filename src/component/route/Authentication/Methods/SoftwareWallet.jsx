import React from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@material-ui/core'
import software from '@vutr/purser-software'
import * as blk from 'service/blockchain'


export default class SoftwareWallet extends React.Component {

  state = {
    privateKey: '',
    wallet: undefined,
    balance: undefined,
  }

  changeKey = e => this.setState({ privateKey: e.target.value })

  changeAddress = () => this.setState({
    wallet: undefined,
    balance: undefined,
  })

  importWallet = async () => {}

  confirm = () => this.props.onConfirm(this.state.wallet)

  render() {

    const {
      privateKey,
      wallet,
      balance,
    } = this.state

    return (
      <Box display="flex" justifyContent="center">
        {!wallet && (
          <Box display="flex" justifyContent="space-between" alignItems="end">
            <TextField
              label="Enter your private key or Mnemonic"
              value={privateKey}
              onChange={this.changeKey}
              type="password"
            />
            <Button onClick={this.importWallet} variant="outlined">
              Import
            </Button>
          </Box>
        )}

        {wallet && (
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" flexDirection="column" className="p-1">
              <Typography component="div">
                Address: {wallet.address}
              </Typography>
              <Typography component="div">
                Balance: {balance} TOMO
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
      </Box>
    )
  }
}
