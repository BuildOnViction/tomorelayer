import React from 'react'
import { connect } from 'redux-zero/react'
import SearchIcon from '@material-ui/icons/Search'
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Link,
  // Switch,
  TextField,
} from '@material-ui/core'
import {
  isEmpty,
} from 'service/helper'
import {
  UserMenu,
  RelayerMenu,
} from './Menus'
import { AdapterLink } from './Adapters'
import logo from 'asset/logo-tomorelayer.svg'


class PageHeader extends React.Component {

  render() {

    const {
      user,
      relayers,
      /* changeTheme,
       * activeTheme, */
    } = this.props

    const auth = Boolean(user.wallet)
    const userOwnRelayer = !isEmpty(relayers)

    return (
      <Box className="tomo-header">
        <Container maxWidth="lg" className="p-1">
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item sm={3} md={2}>
              <img alt="logo" src={logo} height="30px" />
              {/* <Link display="block" component={AdapterLink} to="/">
                  <img alt="logo" src={logo} height="30px" />
                  </Link> */}
            </Grid>
            <Grid item sm={false} md={6}>
              <TextField
                placeholder="Search everything you want…"
                fullWidth
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item sm={6} md={4} container justify="flex-end" direction="row" spacing={4} alignItems="center">
              {auth && userOwnRelayer && <RelayerMenu relayers={relayers} />}
              {auth && !userOwnRelayer && <Button variant="contained" component={AdapterLink} to="/register">Start a Relayer</Button>}
              {auth && <UserMenu />}
              {!auth && <Link component={AdapterLink} to="/login" className="ml-3">Help</Link>}
              {/* <Switch checked={activeTheme === 'dark'} onChange={() => changeTheme()} /> */}
            </Grid>
          </Grid>
        </Container>
      </Box>
    )
  }
}

const mapProps = state => ({
  activeTheme: state.activeTheme,
})

const actions = {
  changeTheme: (state) => ({
    activeTheme: state.activeTheme === 'light' ? 'dark' : 'light'
  }),
}

export default connect(mapProps, actions)(PageHeader)
