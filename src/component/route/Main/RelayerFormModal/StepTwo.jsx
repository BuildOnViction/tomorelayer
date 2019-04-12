import React from 'react'
import { withFormik } from 'formik'
import { connect } from 'redux-zero/react'
import { Button, TextField, Typography } from '@material-ui/core'
import { Grid } from 'component/utility'
import { TradePairSelect } from './SupportComponents'
import { $cancelRegistration, $submitFormPayload } from '../main_actions'

const RegistrationFormStepTwo = props => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
  } = props
  return (
    <form onSubmit={handleSubmit}>
      <div className="col-12 relayer-form-step-body--title border-bottom">
        Step 2: Customize Your Relayer
      </div>
      <div className="col-12">
        <TextField
          name="name"
          label="Relayer Name"
          margin="dense"
          variant="outlined"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          type="text"
          helperText={(<i>* Name length must be longer than 3 characters</i>)}
          fullWidth
        />
      </div>
      <div className="col-12 mb-1">
        <Typography component="h2" className="mb-1">
          <b>Select trade pairs</b>
        </Typography>
        <TradePairSelect
          value={values.tradePairs}
          onChange={handleChange}
          error={errors.tradePairs}
          name="tradePairs"
        />
      </div>
      <Grid className="justify-space-between m-0 pt-5">
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

    const invalidName = typeof values.name !== 'string' || values.name.length < 4
    if (invalidName) errors.name = true

    const emptyTradePair = !values.tradePairs.length
    if (emptyTradePair) errors.tradePairs = true

    return errors
  },

  handleSubmit: (values, { props }) => {
    const { name, tradePairs } = values
    props.$submitFormPayload({
      name: name,
      tradePairs: typeof tradePairs === 'string' ? tradePairs.split(',') : tradePairs,
    })
  },

  displayName: 'RegistrationFormStepTwo',
})(RegistrationFormStepTwo)

const storeConnect = connect(
  state => ({
    name: state.RelayerForm.relayer_meta.name,
    tradePairs: state.RelayerForm.relayer_meta.tradePairs,
  }),
  {
    $cancelRegistration,
    $submitFormPayload,
  },
)

export default storeConnect(FormikWrapper)
