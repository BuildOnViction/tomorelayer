import React from 'react'
import { Link } from 'react-router-dom'
import { Box, TextField } from '@material-ui/core'
import logo from 'asset/app-logo.png'

const PageHeader = () => (
  <Box
    display="flex"
    justifyContent="space-between"
    alignContent="center"
    alignItems="center"
    className="main-menu"
  >
    <div className="col-md-3 col-xs-2 col-xxs-2">
      <Link to="/">
        <img alt="logo" src={logo} height="40" />
      </Link>
    </div>
    <div className="col-md-5 hidden-sm hidden-xs hidden-xxs">
      <TextField
        label="Search"
        margin="dense"
        variant="outlined"
        fullWidth
      />
    </div>
    <div className="col-md-4 text-center row">
      menu...
    </div>
    <div className="col-12 hidden-md hidden-lg hidden-xxl">
      <TextField
        label="Search"
        margin="dense"
        variant="outlined"
        fullWidth
      />
    </div>
  </Box>
)

export default PageHeader
