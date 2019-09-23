import React from 'react'
import { Button, Box, TextField, Typography } from '@material-ui/core'
import { wrappers } from './forms'

const FormStepTwo = props => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    goBack,
  } = props

  const helpText = errors.name ? (
    <i className="text-alert">* {errors.name}</i>
  ) : (
    <Typography style={{ float: 'right' }} variant="subtitle2">
      {200 - values.name.length || 0} words left
    </Typography>
  )

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" className="mb-2">
        Type your relayer name
      </Typography>
      <TextField
        name="name"
        label="Relayer Name"
        id="name-input"
        value={values.name}
        onChange={handleChange}
        error={Boolean(errors.name)}
        helperText={helpText}
        type="text"
        variant="outlined"
        className="mb-2"
        fullWidth
      />
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

export default wrappers.relayerNameForm(FormStepTwo)
