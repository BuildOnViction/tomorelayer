import React from 'react'
import { Box, Button, Typography } from '@material-ui/core'
import metamask from '@vutr/purser-metamask'
import * as blk from 'service/blockchain'


export default class BrowserWallet extends React.Component {
  wallet = undefined

  state = {
    address: undefined,
    balance: undefined,
  }

  requestMetamask = async () => {
    this.wallet = await metamask.open()
    const address = this.wallet.address
    const balance = await blk.getBalance(address)
    this.setState({ address, balance })
  }

  confirm = () => this.props.onConfirm(this.wallet)

  render() {
    const {
      address,
      balance,
    } = this.state

    return (
      <Box display="flex" justifyContent="center">
        {!address && (
          <Box display="flex" justifyContent="center" flexDirection="column">
            <Button onClick={this.requestMetamask} variant="contained">
              Unlock Wallet
            </Button>
          </Box>
        )}
        {address && balance && (
          <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
            <Box display="flex" flexDirection="column" className="p-1">
              <Typography component="div">
                Address: {address}
              </Typography>
              <Typography component="div">
                Balance: {balance} TOMO
              </Typography>
            </Box>
            <Box className="p-1" alignItems="center">
              <Button onClick={this.confirm} variant="contained">
                Use this wallet
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    )
  }
}
