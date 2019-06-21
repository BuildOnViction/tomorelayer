import React from 'react'
import { Box, Button, Container, InputAdornment, TextField, Typography } from '@material-ui/core'
import { wrappers } from './form_logics'
import * as _ from 'service/helper'

const FormStepThree = props => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    goBack,
  } = props

  const handleFeeChange = e => {
    e.target.value = _.round(e.target.value * 100, 0)
    return handleChange(e)
  }

  const formatValue = v => _.round(v / 100, 2)
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
            name="maker_fee"
            label="Maker Fee (min: 0.01%, max: 99.9%)"
            id="maker_fee-input"
            value={formatValue(values.maker_fee)}
            onChange={handleFeeChange}
            error={errors.maker_fee}
            type="number"
            className="mr-1"
            InputProps={{ endAdornment }}
            fullWidth
          />
          <TextField
            name="taker_fee"
            label="Taker Fee (min: 0.01%, max: 99.9%)"
            id="taker_fee-input"
            value={formatValue(values.taker_fee)}
            onChange={handleFeeChange}
            error={errors.taker_fee}
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
          <Button variant="outlined" className="mr-1" onClick={goBack} type="button">
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

export default wrappers.marketFeeForm(FormStepThree)
