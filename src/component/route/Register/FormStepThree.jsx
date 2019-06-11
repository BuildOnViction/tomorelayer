import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { Box, Button, Container, InputAdornment, TextField, Typography } from '@material-ui/core'
import { $backOneStep, $submitFormPayload } from './actions'
import { wrappers } from './form_logics'
import * as _ from 'service/helper'

const FormStepThree = props => {
  const {
    values,
    errors,
    handleSubmit,
    setFieldValue,
  } = props

  const handleFeeChange = key => e => setFieldValue(e.target.value * 10, key)
  const formatValue = v => _.round(v/10, 1)
  const endAdornment = (<InputAdornment position="start">%</InputAdornment>)

  return (
    <form onSubmit={handleSubmit} className="text-left">
      <Box textAlign="center" className="mb-3">
        <Typography component="h1">
          Choose Trading Fee
        </Typography>
      </Box>
      <Container maxWidth="sm">
        <Box display="flex" className="mb-1">
          <TextField
            name="makerFee"
            label="Maker Fee (min: 0.1%, max: 99.9%)"
            value={formatValue(values.makerFee)}
            onChange={handleFeeChange('makerFee')}
            error={errors.makerFee}
            type="number"
            className="mr-1"
            InputProps={{ endAdornment }}
            fullWidth
          />
          <TextField
            name="takerFee"
            label="Taker Fee (min: 0.1%, max: 99.9%)"
            value={formatValue(values.takerFee)}
            onChange={handleFeeChange('takerFee')}
            error={errors.takerFee}
            type="number"
            className="ml-1"
            InputProps={{ endAdornment }}
            fullWidth
          />
        </Box>
        <Typography component="h5" className="mb-2">
          <i>* These fees can be modified later</i>
        </Typography>
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
})

const actions = {
  $submitFormPayload,
  $backOneStep,
}

const storeConnect = connect(mapProps, actions)
const formConnect = wrappers.marketFeeForm(FormStepThree)

export default storeConnect(formConnect)
