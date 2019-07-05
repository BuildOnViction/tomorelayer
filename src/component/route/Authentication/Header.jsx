import React from 'react'
import { Box, Typography } from '@material-ui/core'

const Header = () => (
  <Box justifyContent="start" display="flex" flexDirection="column">
    <Typography component="h1">
      Unlock your wallet
    </Typography>
    <Typography component="h4">
      Start by choosing the wallet you want to unlock
    </Typography>
  </Box>
)

export default Header
