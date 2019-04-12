import React from 'react'
import { withFormik } from 'formik'
import { connect } from 'redux-zero/react'
import { Button, TextField, Typography } from '@material-ui/core'
import { Grid } from 'component/utility'
import { $cancelRegistration, $submitFormPayload } from '../main_actions'

const RegistrationFormStepThree = props => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
  } = props
  return (
    <form onSubmit={handleSubmit}>
      <div className="col-12 relayer-form-step-body--title border-bottom">
        Step 3: Set Trading Fees
      </div>
      <div className="col-12 pb-0">
        <Typography component="h4">
          Set your trading fees for maker and taker.
        </Typography>
      </div>
      <div className="col-12 border-bottom pb-0 pt-0">
        <div className="col-md-6 pl-0">
          <TextField
            name="makerFee"
            label="Maker Fee"
            margin="dense"
            variant="outlined"
            value={values.makerFee}
            onChange={handleChange}
            error={errors.makerFee}
            type="number"
            helperText={(<i>* Minimum: 0.1%</i>)}
            fullWidth
          />
        </div>
        <div className="col-md-6 pr-0">
          <TextField
            name="takerFee"
            label="Taker Fee"
            margin="dense"
            variant="outlined"
            value={values.takerFee}
            onChange={handleChange}
            error={errors.takerFee}
            type="number"
            helperText={(<i>* Minimum: 0.1%</i>)}
            fullWidth
          />
        </div>
      </div>
      <div className="col-12 mb-1">
        <Typography component="h4" className="mb-1">
          <i>These fees can be modified later</i>
        </Typography>
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

  displayName: 'RegistrationFormStepThree',
})(RegistrationFormStepThree)

const storeConnect = connect(
  state => ({
    makerFee: state.RelayerForm.relayer_meta.makerFee,
    takerFee: state.RelayerForm.relayer_meta.takerFee,
  }),
  {
    $cancelRegistration,
    $submitFormPayload,
  },
)

export default storeConnect(FormikWrapper)
