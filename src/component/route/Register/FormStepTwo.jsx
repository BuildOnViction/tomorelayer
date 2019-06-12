import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { Button, Box, Container, TextField, Typography } from '@material-ui/core'
import { $backOneStep, $logout, $submitFormPayload } from './actions'
import { wrappers } from './form_logics'

const FormStepTwo = props => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
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
          value={values.name}
          onChange={handleChange}
          error={errors.name}
          helperText={errors.name && <i className="text-alert">* Name length must be more than 3 characters</i>}
          type="text"
          className="mb-2"
          fullWidth
        />
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
  $logout,
  $submitFormPayload,
  $backOneStep,
}

const storeConnect = connect(mapProps, actions)
const formConnect = wrappers.relayerNameForm(FormStepTwo)

export default storeConnect(formConnect)
