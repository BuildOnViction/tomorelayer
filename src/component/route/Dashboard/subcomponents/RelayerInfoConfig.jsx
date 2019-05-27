import React from 'react'
import { connect } from 'redux-zero/react'
import { Avatar, TextField, Button } from '@material-ui/core'
import { Container, Grid } from 'component/utility'
import { wrappers } from '../form_logics'
import { $submitConfigFormPayload } from '../actions'


class RelayerInfoConfig extends React.Component {
  render() {
    const {
      values,
      errors,
      handleChange,
      handleSubmit,
    } = this.props

    return (
      <Container className="border-all border-rounded">
        <Grid className="row col-12 p-4">
          <form onSubmit={handleSubmit}>
            <div className="row mb-1">
              <TextField
                label="Relayer Name"
                value={values.name || ''}
                onChange={handleChange}
                error={errors.name}
                name="name"
                className="col-6"
                helperText={errors.name && <i className="text-alert">Name must not be either empty or too long!</i>}
              />
            </div>
            <div className="row mb-1">
              <TextField
                label="Link"
                value={values.link || ''}
                name="link"
                onChange={handleChange}
                error={errors.link}
                className="col-6"
                helperText={errors.link && <i className="text-alert">Invalid URL!</i>}
              />
            </div>
            <div className="row mb-1">
              <TextField
                label="Logo"
                value={values.logo || ''}
                onChange={handleChange}
                error={errors.logo}
                name="logo"
                className="col-6"
                helperText={errors.logo && <i className="text-alert">Invalid URL!</i>}
              />
            </div>
            <div className="row mt-1 mb-1">
              <Avatar alt={values.name} src={values.logo} />
            </div>
            <Grid className="row justify-end">
              <Button color="primary" variant="contained" type="submit">
                Save
              </Button>
            </Grid>
          </form>
        </Grid>
      </Container>
    )
  }
}

const mapProps = state => ({
  name: state.User.activeRelayer.name,
  link: state.User.activeRelayer.link,
  logo: state.User.activeRelayer.logo,
})

const storeConnect = connect(mapProps, { $submitConfigFormPayload })
const formConnect = wrappers.basicInfoForm(RelayerInfoConfig)

export default storeConnect(formConnect)
