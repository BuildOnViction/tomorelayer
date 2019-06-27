import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import {
  Container,
  Box,
  Button,
  Paper,
  Typography,
} from '@material-ui/core'
import NotificationImportant from '@material-ui/icons/NotificationImportant'
import { STORAGE_ITEMS } from 'service/constant'
import { AdapterLink } from 'component/shared/Adapters'


class Logout extends React.Component {

  componentDidMount() {
    this.props.logout()
  }

  render() {

    return (
      <Container maxWidth="md">
        <Paper className="p-3 m-3">
          <Box>
            <Typography component="h1">
              <NotificationImportant className="success-icon" />
              You have successfully signed out.
            </Typography>
            <Typography component="div">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc rutrum nisl ut ante dignissim, at tempor elit pellentesque. Donec cursus semper arcu semper vestibulum. Morbi et nibh quis nulla mollis vehicula nec luctus nulla. In eleifend rhoncus sagittis. Donec non odio vel neque laoreet aliquet vel quis dui. Duis id metus nisl. Aliquam a est in neque maximus maximus. Maecenas fringilla nibh porta libero eleifend, quis tempus leo auctor. Vestibulum non felis vel nibh laoreet semper vel eu nisi.
            </Typography>
            <Box className="mt-3" display="flex" justifyContent="end">
              <Button variant="outlined" component={AdapterLink} to="/">
                Go back Home page
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    )
  }
}

const actions = store => ({
  logout: state => {
    window.localStorage.removeItem(STORAGE_ITEMS.user)
    const user = {...state.user}

    for (const key in user) {
      if (key !== 'expire') delete user[key]
    }

    const derived = {...state.derived}

    for (const key in derived) {
      if (key.includes('user')) delete derived[key]
    }

    return { auth: false, user, derived }
  },
})

export default connect(undefined, actions)(Logout)
