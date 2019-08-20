import React from 'react'
import {
  CircularProgress,
  Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/styles'

const StyledCircularProgress = withStyles(theme => ({
  root: {
    width: '100px !important',
    height: '100px !important',
    margin: '200px auto',
  }
}))(CircularProgress)

const MainAppLoader = () => (
  <div className="apploader container">
    <Typography variant="h4" className="mt-5">
      Loading...
    </Typography>
    <StyledCircularProgress />
  </div>
)

export default MainAppLoader
