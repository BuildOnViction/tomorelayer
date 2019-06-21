import React from 'react'
import { Box, Button, Container, TextField, Typography } from '@material-ui/core'
import { MISC } from 'service/constant'
import { wrappers } from './form_logics'

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
          <div>You are required to deposit a minimum {MISC.MinimumDeposit} TOMO.</div>
          <div>This deposit will be locked.</div>
        </Box>
        <TextField
          name="deposit"
          label="Deposit"
          id="deposit-input"
          placeholder={`minimum ${MISC.MinimumDeposit}`}
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
          label="Coinbase"
          id="coinbase-input"
          value={values.coinbase}
          onChange={handleChange}
          error={errors.coinbase}
          helperText={errors.coinbase && <i className="text-alert">* Invalid coinbase address!</i>}
          fullWidth
        />
        <Box display="flex" justifyContent="flex-end" className="mt-2">
          <Button color="primary" variant="contained" type="submit">
            Confirm
          </Button>
        </Box>
      </Container>
    </form>
  )
}

export default wrappers.depositAndCoinbaseForm(FormStepOne)
