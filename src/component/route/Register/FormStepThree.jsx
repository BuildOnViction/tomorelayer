import React from 'react'
import { withFormik } from 'formik'
import { connect } from 'redux-zero/react'
import { Button, InputAdornment, TextField, Typography } from '@material-ui/core'
import { Grid } from 'component/utility'
import { $backOneStep, $submitFormPayload } from './actions'

const FormStepThree = props => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
  } = props
  return (
    <form onSubmit={handleSubmit} className="text-left">
      <h1 className="register-form--title">
        Choose trading fees
      </h1>
      <div className="row mt-2">
        <div className="col-md-6 pl-0 pr-2">
          <TextField
            name="makerFee"
            label="Maker"
            value={values.makerFee}
            onChange={handleChange}
            error={errors.makerFee}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="start">%</InputAdornment>,
            }}
            fullWidth
          />
        </div>
        <div className="col-md-6 pr-0 pl-2">
          <TextField
            name="takerFee"
            label="Taker"
            value={values.takerFee}
            onChange={handleChange}
            error={errors.takerFee}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="start">%</InputAdornment>,
            }}
            fullWidth
          />
        </div>
      </div>
      <Typography component="h4" className="mb-2">
        <i>* These fees can be modified later</i>
      </Typography>
      <Grid className="justify-space-between m-0">
        <Button variant="outlined" className="mr-1" onClick={props.$backOneStep} type="button">
          Back
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
    if (values.makerFee < 0.1) errors.makerFee = true
    if (values.takerFee < 0.1) errors.takerFee = true
    return errors
  },

  handleSubmit: (values, { props }) => {
    props.$submitFormPayload({
      makerFee: values.makerFee,
      takerFee: values.takerFee,
    })
  },

  displayName: 'FormStepThree',
})(FormStepThree)

const storeConnect = connect(
  state => ({
    makerFee: state.RelayerForm.relayer_meta.makerFee,
    takerFee: state.RelayerForm.relayer_meta.takerFee,
  }),
  {
    $submitFormPayload,
    $backOneStep,
  },
)

export default storeConnect(FormikWrapper)
