import React from 'react'
import { Box, Button, Typography, Icon } from '@material-ui/core'
import { AdapterLink, StyledLink } from 'component/shared/Adapters'

const SuccessRegistration = ({ navigate, deposit }) => (
  <Box display="flex" flexDirection="column">
    <Box display="flex" justifyContent="center" className="mb-1">
      <Icon fontSize="large">check_circle_outline</Icon>
    </Box>
    <Box className="text-center">
      <Typography variant="h4" className="mb-3">
        Successful!
      </Typography>
      <Typography variant="body1">
        You’ve succesfully deposited {deposit} TOMO to SmartContract
      </Typography>
      <Typography component="div" variant="body2" style={{ lineHeight: 1.3 }}>
        To launch your own DEX using Tomo-SDK, <br /> follow this <StyledLink href="https://github.com/tomochain/tomox-launch-kit/blob/master/README.md" rel="noopener noreferrer" target="_blank">link</StyledLink> for detailed instructions
      </Typography>
    </Box>
    <Box display="flex" justifyContent="center" className="mt-2">
      <Button variant="contained" component={AdapterLink} to={navigate}>
        Go to Relayer Page
      </Button>
    </Box>
  </Box>
)

export default SuccessRegistration
