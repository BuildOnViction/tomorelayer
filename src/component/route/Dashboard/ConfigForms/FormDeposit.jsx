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
            </Grid>
            <Grid item>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
            </Grid>
            <Grid item container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  label="Deposit amount (minimum 1 TOMO)"
                  value={values.deposit}
                  onChange={handleChange}
                  error={Boolean(errors.deposit)}
                  type="number"
                  name="deposit"
                  variant="outlined"
                  InputProps={{
                    endAdornment: 'TOMO'
                  }}
                  // eslint-disable-next-line
                  inputProps={{
                    'data-testid': 'deposit-input'
                  }}
                  fullWidth
                  disabled={isSubmitting || relayer.resigning}
                />
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
  RelayerContract: state.blk.RelayerContract
})

const actions = {
  UpdateRelayer,
  PushAlert,
}

const storeConnect = connect(mapProps, actions)
const formConnect = wrappers.depositForm
export default compose(formConnect, storeConnect)(FormDeposit)
