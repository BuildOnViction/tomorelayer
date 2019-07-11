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
      <Typography variant="h5" className="mb-2">
        Choose trading fee
      </Typography>
      <Box display="flex" className="mb-1">
        <TextField
          name="trade_fee"
          label="Trade Fee (min: 0.01%, max: 99.9%)"
          id="trade_fee-input"
          value={values.trade_fee}
          onChange={handleChange}
          error={errors.trade_fee}
          type="number"
          margin="dense"
          variant="outlined"
          inputProps={{
            step: 0.01,
            max: 99.99,
            min: 0.01,
          }}
          fullWidth
          InputProps={{ endAdornment: '%' }}
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
          Confirm
        </Button>
      </Box>
    </form>
  )
}

export default wrappers.marketFeeForm(FormStepThree)
