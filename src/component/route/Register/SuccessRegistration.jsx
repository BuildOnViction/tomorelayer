import React from 'react'
import { Box, Button, Typography } from '@material-ui/core'
import CheckCircle from '@material-ui/icons/CheckCircle'
import { AdapterLink } from 'component/shared/Adapters'

const SuccessRegistration = ({ relayerId }) => (
  <Box>
    <Typography component="h1">
      <CheckCircle className="success-icon" />
      Success
    </Typography>
    <Typography component="div">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum nisl ut ante dignissim, at tempor elit pellentesque. Donec cursus semper arcu semper vestibulum. Morbi et nibh quis nulla mollis vehicula nec luctus nulla. In eleifend rhoncus sagittis. Donec non odio vel neque laoreet aliquet vel quis dui. Duis id metus nisl. Aliquam a est in neque maximus maximus. Maecenas fringilla nibh porta libero eleifend, quis tempus leo auctor. Vestibulum non felis vel nibh laoreet semper vel eu nisi.
    </Typography>
    <Box className="mt-3" display="flex" justifyContent="end">
      <Button variant="outlined" component={AdapterLink} to={`/dashboard/${relayerId}`}>
        Go to Dashboard
      </Button>
    </Box>
  </Box>
)

export default SuccessRegistration
