import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { Box, Button, Container, TextField, Typography } from '@material-ui/core'
import { MISC } from 'service/constant'
import { $cancelRegistration, $logout, $submitFormPayload } from './actions'
import { wrappers } from './form_logics'

const MINIMUM_DEPOSIT = MISC.MinimumDeposit

const FormStepOne = props => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
  } = props

  return (
    <form onSubmit={handleSubmit} className="text-left">
      <Box textAlign="center" className="mb-3">
        <Typography component="h1">
          Relayer Registration
        </Typography>
      </Box>
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" className="mb-2">
          <div>You are required to deposit a minimum {MINIMUM_DEPOSIT} TOMO.</div>
          <div>This deposit will be locked.</div>
        </Box>
        <TextField
          name="deposit"
          label="Deposit"
          placeholder={`minimum ${MINIMUM_DEPOSIT}`}
          value={values.deposit}
          onChange={handleChange}
          error={errors.deposit}
          helperText={errors.deposit && <i className="text-alert">* Minimum deposit is 25,000 TOMO</i>}
          type="number"
          className="mb-2"
          fullWidth
        />
        <TextField
          name="coinbase"
          label="Coinbase Address"
          value={values.coinbase}
          onChange={handleChange}
          error={errors.coinbase}
          helperText={errors.coinbase && <i className="text-alert">* Invalid coinbase address!</i>}
          fullWidth
        />
        <Box display="flex" justifyContent="space-between" className="mt-2">
          <Button variant="outlined" className="mr-1" onClick={props.$backOneStep} type="button">
            Back
          </Button>
          <Button color="primary" variant="contained" type="submit">
            Confirm
          </Button>
        </Box>
      </Container>
    </form>
  )
}

const mapProps = state => ({
  relayer_meta: state.RelayerForm.relayer_meta,
  user: state.authStore.user_meta.address,
  used_coinbase: state.Relayers.map(r => r.coinbase.toLowerCase()),
})

const actions = {
  $logout,
  $submitFormPayload,
  $cancelRegistration,
}

const storeConnect = connect(mapProps, actions)
const formConnect = wrappers.depositAndCoinbaseForm(FormStepOne)

export default storeConnect(formConnect)
