import React from 'react'
import { withFormik } from 'formik'
import { connect } from 'redux-zero/react'
import { Button, TextField } from '@material-ui/core'
import { MISC } from 'service/constant'
import { validateCoinbase, bigNumberify } from 'service/blockchain'
import { Grid } from 'component/utility'
import { $cancelRegistration, $logout, $submitFormPayload } from './actions'

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
      <h1 className="register-form--title">
        Relayer Registration
      </h1>
      <div className="register-form--note">
        <div className="mb-1">You are required to deposit a minimum {MINIMUM_DEPOSIT} TOMO.</div>
        <div>This deposit will be locked.</div>
      </div>
      <div className="col-12 p-0 mt-3 mb-3">
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
          name="address"
          label="Coinbase Address"
          value={values.address}
          onChange={handleChange}
          error={errors.address}
          helperText={errors.address && <i className="text-alert">* Invalid coinbase address!</i>}
          fullWidth
        />
      </div>
      <Grid className="justify-space-between m-0">
        <Button variant="outlined" className="mr-1" onClick={props.$cancelRegistration} type="button">
          Cancel
        </Button>
        <Button color="primary" variant="contained" type="submit">
          Confirm
        </Button>
      </Grid>
    </form>
  )
}

const FormikWrapper = withFormik({
  validateOnChange: false,
  validate: values => {
    const errors = {}

    validateCoinbase(values.address, isValid => {
      if (!isValid) errors.address = true
    })

    const currentDeposit = bigNumberify(values.deposit)
    const invalidDeposit = currentDeposit.lt(MINIMUM_DEPOSIT)
    if (invalidDeposit) errors.deposit = true

    return errors
  },

  handleSubmit: (values, { props }) => {
    props.$submitFormPayload({ deposit: values.deposit })
  },

  displayName: 'FormStepOne',
})(FormStepOne)

const storeConnect = connect(
  state => ({
    deposit: state.RelayerForm.relayer_meta.deposit,
  }),
  {
    $logout,
    $submitFormPayload,
    $cancelRegistration,
  }
)

export default storeConnect(FormikWrapper)
