import React from 'react'
import { Grid, Container } from '@material-ui/core'
import LangSelector from './LangSelector'

const TopBar = () => (
  <Container className="pt-1">
    <Grid className="align-center justify-end pr-5">
      <button className="btn btn--minimal help-badge mr-2">
        <i className="icon-help-circled-alt" />
      </button>
      <LangSelector />
    </Grid>
  </Container>
)

export default TopBar
