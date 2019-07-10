import React from 'react'
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from '@material-ui/core'
import { connect } from 'redux-zero/react'
import { Logout as confirmLogout } from 'component/shared/actions'


class Logout extends React.Component {

  render() {
    return (
      <Container maxWidth="xs" className="mt-5">
        <Paper className="p-1" elevation={0}>
          <Box display="flex" flexDirection="column">
            <Typography variant="h6" className="mt-1 text-center">
              Are you sure you want to log out?
            </Typography>
            <Box className="m-2" display="flex" justifyContent="center">
              <Button variant="contained" color="primary" onClick={this.props.confirmLogout}>
                Confirm
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    )
  }
}

const mapProps = undefined

const actions = {
  confirmLogout,
}

export default connect(mapProps, actions)(Logout)
