import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { Button, InputAdornment, TextField, Typography } from '@material-ui/core'
import { Grid } from 'component/utility'
import { $backOneStep, $submitFormPayload } from './actions'
import { wrappers } from './form_logics'

const FormStepThree = props => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
  } = props

  const handleFeeChange = e => {
    e.target.value = e.target.value * 10
    return handleChange(e)
  }

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
            value={values.makerFee / 10}
            onChange={handleFeeChange}
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
            value={values.takerFee / 10}
            onChange={handleFeeChange}
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

const mapProps = state => ({
  relayer_meta: state.RelayerForm.relayer_meta,
})

const actions = {
  $submitFormPayload,
  $backOneStep,
}

const storeConnect = connect(mapProps, actions)
const formConnect = wrappers.marketFeeForm(FormStepThree)

export default storeConnect(formConnect)
