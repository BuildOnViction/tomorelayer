import React from 'react'
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
} from '@material-ui/core'
import { connect } from 'redux-zero/react'


class Logout extends React.Component {

  render() {
    return (
      <Container maxWidth="md">
        <Paper className="p-4">
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="center" >
              <Typography component="h1">
                Logout of Tomorelayer
              </Typography>
            </Box>
            <Box className="m-2" display="flex" justifyContent="center" >
              <Typography component="p">
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
              </Typography>
            </Box>
            <Box className="m-2" display="flex" justifyContent="center">
              <Button variant="contained" color="primary" onClick={this.props.confirmLogout}>
                Logout
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    )
  }
}

const actions = {
  confirmLogout: (state) => ({
    user: {
      ...state.user,
      wallet: undefined
    }
  })
}

export default connect(undefined, actions)(Logout)
