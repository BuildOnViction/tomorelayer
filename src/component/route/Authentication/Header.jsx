import React from 'react'
import { Box, Typography } from '@material-ui/core'

const Header = () => (
  <Box justifyContent="start" display="flex" flexDirection="column">
    <Typography variant="subtitle1" component="h1">
      Unlock your wallet
    </Typography>
    <div className="txt-undertitle">
      Start by choosing the wallet you want to unlock
    </div>
  </Box>
)

export default Header
