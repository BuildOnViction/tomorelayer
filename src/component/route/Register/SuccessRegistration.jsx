import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@material-ui/core'
import { Grid } from 'component/utility'
import CheckCircle from '@material-ui/icons/CheckCircle'

const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />)

const SuccessRegistration = () => (
  <div className="text-left">
    <h1 className="register-form--title text-center">
      <CheckCircle className="success-icon" />
      Success
    </h1>
    <div className="row mt-3 register-form--success-info">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum nisl ut ante dignissim, at tempor elit pellentesque. Donec cursus semper arcu semper vestibulum. Morbi et nibh quis nulla mollis vehicula nec luctus nulla. In eleifend rhoncus sagittis. Donec non odio vel neque laoreet aliquet vel quis dui. Duis id metus nisl. Aliquam a est in neque maximus maximus. Maecenas fringilla nibh porta libero eleifend, quis tempus leo auctor. Vestibulum non felis vel nibh laoreet semper vel eu nisi.
    </div>
    <Grid className="justify-end mt-3">
      <Button variant="outlined" component={AdapterLink} to="/dashboard">
        Go to Dashboard
      </Button>
    </Grid>
  </div>
)

export default SuccessRegistration
