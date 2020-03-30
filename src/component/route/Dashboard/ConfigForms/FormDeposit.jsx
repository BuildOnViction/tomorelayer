import React from 'react'
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'
import { connect } from 'redux-zero/react'
import { getBalance, fromWei } from 'service/blockchain'
import { compose } from 'service/helper'
import { PushAlert } from 'service/frontend'
import { UpdateRelayer } from '../actions'
import { wrappers } from './forms'


class FormDeposit extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      userBalance: 0,
    }
  }

  async componentDidMount() {
    const address = await this.props.wallet.getAddress()
    const userBalance = await getBalance(address)
    this.setState({ userBalance })
  }

  render() {
    const {
      values,
      errors,
      handleChange,
      handleSubmit,
      isSubmitting,
      relayer,
    } = this.props

    const {
      userBalance,
    } = this.state

    const inputDisabled = isSubmitting || relayer.resigning || values.deposit < 1

    if (relayer.resigning) {
      return (
        <Box>
          <Typography component="h4">
            This relayer has been requested to deactivated. Updating relayer is no longer allowed.
          </Typography>
        </Box>
      )
    }

    return (
      <Container>
        <form onSubmit={handleSubmit}>
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Typography variant="h5">
                Deposit
              </Typography>
              <Grid item>
                Remaining deposit: {fromWei(relayer.deposit)} TOMO
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={2} className="mt-2">
              <Grid item>
                <TextField
                  label="How many TOMO would you like to deposit? (minimum 1 TOMO)"
                  value={values.deposit}
                  onChange={handleChange}
                  error={Boolean(errors.deposit)}
                  type="number"
                  name="deposit"
                  variant="outlined"
                  InputProps={{
                    endAdornment: 'TOMO',
                    inputProps: {
                      'data-testid': 'deposit-input'
                    }
                  }}
                  fullWidth
                  disabled={isSubmitting || relayer.resigning}
                />
              </Grid>
              <Grid item>
                <Typography variant="body2">{`Current balance: ${userBalance} TOMO`}</Typography>
              </Grid>
            </Grid>
            <Grid item container justify="center">
              <Button variant="contained" type="submit" data-testid="confirm-button" disabled={inputDisabled}>
                Confirm
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    )
  }
}

const mapProps = state => ({
  RelayerContract: state.blk.RelayerContract,
  wallet: state.user.wallet,
})

const actions = {
  UpdateRelayer,
  PushAlert,
}

const storeConnect = connect(mapProps, actions)
const formConnect = wrappers.depositForm
export default compose(formConnect, storeConnect)(FormDeposit)
