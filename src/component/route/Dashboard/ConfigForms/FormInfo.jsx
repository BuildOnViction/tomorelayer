import React from 'react'
import { Avatar, Box, Container, Grid, TextField, Button, Typography } from '@material-ui/core'
import { connect } from '@vutr/redux-zero/react'
import { compose } from 'service/helper'
import { PushAlert } from 'service/frontend'
import { UpdateRelayer } from '../actions'
import { wrappers } from './forms'


class FormInfo extends React.Component {
  render() {
    const {
      values,
      errors,
      handleChange,
      handleSubmit,
      isSubmitting,
      relayer,
    } = this.props

    const inputDisabled = isSubmitting || relayer.resigning


    return (
      <Container className="border-all border-rounded p-4" maxWidth="xl">
        {relayer.resigning && (
          <Box>
            <Typography component="h4">
              This relayer has been requested to deactivated. Updating relayer is no longer allowed.
            </Typography>
          </Box>
        )}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5} direction="column">
            <Grid item>
              <TextField
                label="Relayer Name"
                value={values.name || ''}
                onChange={handleChange}
                error={Boolean(errors.name)}
                id="relayer-name"
                name="name"
                helperText={errors.name && <i className="text-alert">{errors.name}</i>}
                disabled={inputDisabled}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Link"
                value={values.link || ''}
                id="relayer-link"
                name="link"
                onChange={handleChange}
                error={Boolean(errors.link)}
                helperText={errors.link && <i className="text-alert">{errors.link}</i>}
                disabled={inputDisabled}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Logo"
                value={values.logo || ''}
                onChange={handleChange}
                error={Boolean(errors.logo)}
                id="relayer-logo"
                name="logo"
                helperText={errors.logo && <i className="text-alert">{errors.logo}</i>}
                disabled={inputDisabled}
              />
            </Grid>
            <Grid item>
              <Box display="flex" flexDirection="row">
                <Avatar alt={values.name} src={values.logo} className="mr-1"/>
                <div>
                  <div>instruction 1</div>
                  <div>instruction 2</div>
                  <div>instruction 3</div>
                </div>
              </Box>
            </Grid>
            <Grid item>
              <Box display="flex" justifyContent="flex-end">
                <Button color="primary" variant="contained" type="submit" data-testid="save-button" disabled={inputDisabled}>
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    )
  }
}

const mapProps = undefined
const actions = {
  UpdateRelayer,
  PushAlert,
}

const storeConnect = connect(mapProps, actions)
const formConnect = wrappers.infoForm
export default compose(formConnect, storeConnect)(FormInfo)
