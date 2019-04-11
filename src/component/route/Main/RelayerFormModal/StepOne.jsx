import React from 'react'
import { withFormik } from 'formik'
import { connect } from 'redux-zero/react'
import * as ethers from 'ethers'
import { TextField, Button } from '@material-ui/core'
import { MISC } from 'service/constant'
import { Grid } from 'component/utility'
import { $cancelRegistration, $submitFormPayload } from '../main_actions'

const MINIMUM_DEPOSIT = MISC.MinimumDeposit

const RegistrationFormStepOne = props => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
  } = props;
  return (
    <form onSubmit={handleSubmit}>
      <div className="col-12 relayer-form-step-body--title border-bottom">
        Step 1: Submit Register Information
      </div>
      <div className="col-12 border-bottom pb-1">
        <div className="mb-1">You are required to deposit a minimum {MINIMUM_DEPOSIT} TOMO.</div>
        <div>This deposit will be locked.</div>
      </div>
      <div className="col-12 pb-1">
        <TextField
          name="deposit"
          label="Deposit"
          margin="dense"
          variant="outlined"
          placeholder={`minimum ${MINIMUM_DEPOSIT}`}
          className="pb-1"
          value={values.deposit}
          onChange={handleChange}
          error={errors.deposit}
          type="number"
          fullWidth
        />
        <TextField
          name="address"
          label="Coinbase Address"
          margin="dense"
          variant="outlined"
          value={values.address}
          onChange={handleChange}
          fullWidth
          disabled
        />
      </div>
      <Grid className="justify-space-between m-0 mt-1">
        <Button size="small" variant="contained" className="mr-1" onClick={props.$cancelRegistration} type="button">
          Cancel
        </Button>
        <Button size="small" color="primary" variant="contained" type="submit">
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

    const invalidAddress = typeof values.address !== 'string' || values.address.length === 0
    if (invalidAddress) errors.address = true

    const currentDeposit = ethers.utils.bigNumberify(values.deposit)
    const invalidDeposit = currentDeposit.lt(MINIMUM_DEPOSIT)
    if (invalidDeposit) errors.deposit = true

    return errors
  },

  handleSubmit: (values, { props }) => {
    props.$submitFormPayload({ deposit: values.deposit })
  },

  displayName: 'RegistrationFormStepOne',
})(RegistrationFormStepOne)

const storeConnect = connect(
  state => ({
    address: state.authStore.user_meta.address,
    deposit: state.RelayerForm.relayer_meta.deposit,
  }),
  {
    $cancelRegistration,
    $submitFormPayload,
  },
)

export default storeConnect(FormikWrapper)
