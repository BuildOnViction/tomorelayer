import React from 'react'
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'
import { ethers } from 'ethers'
import software from '@vutr/purser-software'
import * as blk from 'service/blockchain'
import WalletSigner from 'service/wallet'


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

  importWallet = async () => {
    const privateKey = this.state.privateKey
    const isMnemonic = privateKey.includes(' ')
    const walletArgument = isMnemonic ? { mnemonic: privateKey } : { privateKey }
    const wallet = await software.open({ ...walletArgument, chainId: 89 })
    const balance = await blk.getBalance(wallet.address)
    this.setState({ wallet, balance })
  }

  confirm = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC)
    const signer = new WalletSigner(this.state.wallet, provider)
    this.props.onConfirm(signer)
  }

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
            <Grid item>
              <Button onClick={this.importWallet} variant="contained">
                Import
              </Button>
            </Grid>
          </Grid>
        )}

        {wallet && (
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
        )}
      </Container>
    )
  }
}
