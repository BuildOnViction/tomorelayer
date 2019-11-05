import React from 'react'
import {
  Box,
  Button,
  TextField,
  Typography,
} from '@material-ui/core'
import { wrappers } from './forms'

const FormStepThree = props => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    goBack,
  } = props

  return (
    <form onSubmit={handleSubmit} className="text-left">
      <Typography variant="h5" className="mb-1">
        Set the trading fee
      </Typography>
      <Typography variant="body2" className="mb-2">
        The brokerage fee is chaged when a trader buy or sell tokens
      </Typography>
      <Box display="flex" className="mb-1">
        <TextField
          name="trade_fee"
          label="Trading Fee (Min: 0.1%, Max: 10.0%)"
          id="trade_fee-input"
          value={values.trade_fee}
          onChange={handleChange}
          error={errors.trade_fee}
          type="number"
          variant="outlined"
          fullWidth
          InputProps={{ 
            endAdornment: '%',
            inputProps: {
              step: 0.1,
              max: 10.0,
              min: 0.1,
            }
          }}
        />
      </Box>
      <Typography variant="body2" className="mb-2">
        * Fee can be modified later
      </Typography>
      <Box display="flex" justifyContent="space-between" className="mt-2">
        <Button color="secondary" variant="contained" onClick={goBack} type="button">
          Back
        </Button>
        <Button color="primary" variant="contained" type="submit">
          Save & Continue
        </Button>
      </Box>
    </form>
  )
}

export default wrappers.marketFeeForm(FormStepThree)
