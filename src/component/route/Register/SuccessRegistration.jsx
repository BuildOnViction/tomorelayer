import React from 'react'
import { Box, Button, Typography, Icon } from '@material-ui/core'
import { AdapterLink } from 'component/shared/Adapters'

const SuccessRegistration = ({ navigate }) => (
  <Box display="flex" flexDirection="column">
    <Box display="flex" justifyContent="center" className="mb-2">
      <Icon fontSize="large">check_circle_outline</Icon>
    </Box>
    <Box className="text-center">
      <Typography component="div" variant="subtitle1">
        Successfull!
      </Typography>
      <Typography component="div" variant="body1">
        You’ve succesfully deposited 5000 TOMO to SmartContract
      </Typography>
    </Box>
    <Box display="flex" justifyContent="center" className="mt-2">
      <Button variant="contained" component={AdapterLink} to={navigate}>
        Back to balance
      </Button>
    </Box>
  </Box>
)

export default SuccessRegistration
