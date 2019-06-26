import React from 'react'
import {
  Box,
  Button,
  Container,
  Grid,
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
      <Container maxWidth="md">
        {!wallet && (
          <Grid container alignItems="flex-end" justify="center">
            <Grid item sm={10} md={6} className="pr-3">
              <TextField
                label="Enter your private key or Mnemonic"
                value={privateKey}
                onChange={this.changeKey}
                type="password"
                fullWidth
              />
            </Grid>
            <Grid item justify="center">
              <Button onClick={this.importWallet} variant="outlined">
                Import
              </Button>
            </Grid>
          </Grid>
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
      </Container>
    )
  }
}
