import React from 'react'
import { connect } from 'redux-zero/react'
import { TextField } from '@material-ui/core'
import { Container, Grid } from 'component/utility'

class ConfigureBoardInfo extends React.Component {
  render() {
    const { relayer } = this.props

    return (
      <Container className="border-all border-rounded">
        <Grid className="row col-12 p-4">
          <form>
            <div className="row mb-1">
              <TextField label="Relayer Name" value={relayer.name} name="name" className="col-6" />
            </div>
            <div className="row mb-1">
              <TextField label="Link" value={relayer.link} name="link" className="col-6" />
            </div>
          </form>
        </Grid>
      </Container>
    )
  }
}

const mapProps = state => ({
})

export default connect(mapProps)(ConfigureBoardInfo)
