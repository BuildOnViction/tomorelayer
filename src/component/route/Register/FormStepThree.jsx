import React from 'react'
import {
  Box,
  Button,
  Container,
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
      <Typography variant="h5" className="text-center mb-2">
        Choose trading fee
      </Typography>
      <Container maxWidth="sm">
        <Box display="flex" className="mb-1">
          <TextField
            name="maker_fee"
            label="Maker Fee (min: 0.01%, max: 99.9%)"
            id="maker_fee-input"
            value={values.maker_fee}
            onChange={handleChange}
            error={errors.maker_fee}
            type="number"
            className="mr-1"
            margin="dense"
            variant="outlined"
            inputProps={{
              step: 0.01,
              max: 99.99,
              min: 0.01,
            }}
            fullWidth
          />
          <TextField
            name="taker_fee"
            label="Taker Fee (min: 0.01%, max: 99.9%)"
            id="taker_fee-input"
            value={values.taker_fee}
            onChange={handleChange}
            error={errors.taker_fee}
            type="number"
            className="ml-1"
            margin="dense"
            variant="outlined"
            inputProps={{
              step: 0.01,
              max: 99.99,
              min: 0.01,
            }}
            fullWidth
          />
        </Box>
        <Typography variant="body2" className="mb-2">
          * These fees can be modified later
        </Typography>
        <Box display="flex" justifyContent="space-between" className="mt-2">
          <Button color="secondary" variant="contained" className="mr-1" onClick={goBack} type="button">
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
