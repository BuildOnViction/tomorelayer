import React from 'react'
import { Button, Box, Container, TextField, Typography } from '@material-ui/core'
import { wrappers } from './forms'

const FormStepTwo = props => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    goBack,
  } = props

  return (
    <form onSubmit={handleSubmit}>
      <Box textAlign="center" className="mb-3">
        <Typography component="h1">
          Choose Relayer Name
        </Typography>
      </Box>
      <Container maxWidth="sm">
        <TextField
          name="name"
          label="Relayer Name"
          id="name-input"
          value={values.name}
          onChange={handleChange}
          error={Boolean(errors.name)}
          helperText={errors.name && <i className="text-alert">* {errors.name}</i>}
          type="text"
          className="mb-2"
          fullWidth
        />
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

export default wrappers.relayerNameForm(FormStepTwo)
