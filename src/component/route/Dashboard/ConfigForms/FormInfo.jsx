import React from 'react'
import { Avatar, Box, Container, Grid, TextField, Button, Typography } from '@material-ui/core'
import { connect } from 'redux-zero/react'
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
      <Container>
        {relayer.resigning && (
          <Box>
            <Typography component="h4">
              This relayer has been requested to deactivated. Updating relayer is no longer allowed.
            </Typography>
          </Box>
        )}
        <form onSubmit={handleSubmit}>
          <Grid item container spacing={6} direction="column">
            <Grid item container>
              <Grid item sm={6} md={4} className="pr-2">
                <Avatar alt={values.name} src={values.logo} className="mr-1" style={{ width: '100%', height: '100%' }} />
              </Grid>
              <Grid item sm={6} md={8} container direction="column" spacing={2}>
                <Grid item>
                  <TextField
                    label="Relayer Logo"
                    value={values.logo || ''}
                    onChange={handleChange}
                    error={Boolean(errors.logo)}
                    id="relayer-logo"
                    name="logo"
                    variant="outlined"
                    helperText={errors.logo && <i className="text-alert">{errors.logo}</i>}
                    disabled={inputDisabled}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <div>Ratio: 1:1</div>
                  <div>Recommended size 300x300</div>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <TextField
                label="Relayer Name"
                value={values.name || ''}
                onChange={handleChange}
                error={Boolean(errors.name)}
                id="relayer-name"
                name="name"
                variant="outlined"
                helperText={errors.name && <i className="text-alert">{errors.name}</i>}
                disabled={inputDisabled}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label="Website"
                value={values.link || ''}
                id="relayer-link"
                name="link"
                onChange={handleChange}
                error={Boolean(errors.link)}
                variant="outlined"
                helperText={errors.link && <i className="text-alert">{errors.link}</i>}
                disabled={inputDisabled}
                fullWidth
              />
            </Grid>
            <Grid item container justify="center">
              <Button color="primary" variant="contained" type="submit" data-testid="save-button" disabled={inputDisabled}>
                Save
              </Button>
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
