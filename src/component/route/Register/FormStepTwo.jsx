import React from 'react'
import { withFormik } from 'formik'
import { connect } from 'redux-zero/react'
import { Button, TextField } from '@material-ui/core'
import { Grid } from 'component/utility'
import { $backOneStep, $logout, $submitFormPayload } from './actions'


const FormStepTwo = props => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
  } = props

  return (
    <form onSubmit={handleSubmit} className="text-left">
      <h1 className="register-form--title">
        Choose Your Relayer Name
      </h1>
      <div className="col-12 p-0 mt-3 mb-1">
        <TextField
          name="name"
          label="Relayer Name"
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          helperText={errors.name && <i className="text-alert">* Name length must be more than 3 characters</i>}
          type="text"
          className="mb-2"
          fullWidth
        />
      </div>
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

    if (!values.name || values.name.length < 3) {
      errors.name = true
    }

    return errors
  },

  handleSubmit: (values, { props }) => {
    props.$submitFormPayload({ name: values.name })
  },

  displayName: 'FormStepTwo',
})(FormStepTwo)

const storeConnect = connect(
  state => ({
    name: state.RelayerForm.relayer_meta.name,
  }),
  {
    $logout,
    $submitFormPayload,
    $backOneStep,
  }
)

export default storeConnect(FormikWrapper)
