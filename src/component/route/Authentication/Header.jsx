import React from 'react'
import { Box, Typography } from '@material-ui/core'
import logo from 'asset/relayer-logo.png'

const Header = () => (
  <Box flexDirection="column">
    <Box justifyContent="center" display="flex">
      <img
        alt="logo"
        src={logo}
        className="relayer-logo"
        height="80"
      />
    </Box>
    <Box justifyContent="center" display="flex">
      <Typography component="h1">
        Unlock your wallet
      </Typography>
    </Box>
    <Box justifyContent="center" display="flex">
      <Typography component="h4">
        Start by choosing the wallet you want to unlock
      </Typography>
    </Box>
  </Box>
)

export default Header
