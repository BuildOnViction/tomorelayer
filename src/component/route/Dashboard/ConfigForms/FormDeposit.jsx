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
import { compose } from 'service/helper'
import { PushAlert } from 'service/frontend'
import { UpdateRelayer } from '../actions'
import { wrappers } from './forms'


class FormDeposit extends React.Component {
  render() {
    const {
      values,
      errors,
      handleChange,
      handleSubmit,
      isSubmitting,
      relayer,
    } = this.props

    const inputDisabled = isSubmitting || relayer.resigning

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
            </Grid>
            <Grid item>
              <Typography variant="body1">{relayer.name}</Typography>
              <div className="text-hint">
                Coinbase: {relayer.coinbase}
              </div>
              <div className="text-hint">
                Balance: {relayer.deposit}
              </div>
            </Grid>
            <Grid item container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  label="Deposit amount"
                  value={values.deposit}
                  onChange={handleChange}
                  error={Boolean(errors.deposit)}
                  name="owner"
                  margin="dense"
                  variant="outlined"
                  inputProps={{
                    'data-testid': 'deposit-input'
                  }}
                  fullWidth
                  disabled={inputDisabled}
                />
              </Grid>
            </Grid>
            <Grid item container justify="center">
              <Button variant="contained" type="submit">
                Confirm
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    )
  }
}

const mapProps = undefined
const actions = {
  UpdateRelayer,
  PushAlert,
}

const storeConnect = connect(mapProps, actions)
const formConnect = wrappers.depositForm
export default compose(formConnect, storeConnect)(FormDeposit)
