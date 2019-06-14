import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { Avatar, Box, Container, Grid, TextField, Button } from '@material-ui/core'
import { wrappers } from '../form_logics'
import { $submitConfigFormPayload } from '../actions'


class FormInfo extends React.Component {
  render() {
    const {
      values,
      errors,
      handleChange,
      handleSubmit,
    } = this.props

    return (
      <Container className="border-all border-rounded p-4" maxWidth="xl">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={5} direction="column">
            <Grid item>
              <TextField
                label="Relayer Name"
                value={values.name || ''}
                onChange={handleChange}
                error={errors.name}
                name="name"
                helperText={errors.name && <i className="text-alert">Name must not be either empty or too long!</i>}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Link"
                value={values.link || ''}
                name="link"
                onChange={handleChange}
                error={errors.link}
                helperText={errors.link && <i className="text-alert">Invalid URL!</i>}
              />
            </Grid>
            <Grid item>
              <TextField
                label="Logo"
                value={values.logo || ''}
                onChange={handleChange}
                error={errors.logo}
                name="logo"
                helperText={errors.logo && <i className="text-alert">Invalid URL!</i>}
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
                <Button color="primary" variant="contained" type="submit">
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

const mapProps = state => ({
  relayer: state.User.activeRelayer
})
const storeConnect = connect(mapProps, { $submitConfigFormPayload })
const formConnect = wrappers.infoForm(FormInfo)

export default storeConnect(formConnect)
