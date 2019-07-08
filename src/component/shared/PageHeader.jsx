import React from 'react'
import {
  Button,
  Box,
  Container,
  Grid,
  Link,
  InputAdornment,
  TextField,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import * as _ from 'service/helper'
import { AdapterLink } from './Adapters'
import { UserMenu, RelayerMenu } from './Menus'
import logo from 'asset/logo-tomorelayer.svg'

class PageHeader extends React.Component {

  render() {

    const {
      user,
      relayers,
    } = this.props

    const auth = Boolean(user.wallet)
    const userOwnRelayer = !_.isEmpty(relayers)

    return (
      <Box className="tomo-header">
        <Container maxWidth="lg" className="p-1">
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item sm={3} md={2}>
              <Link display="block" component={AdapterLink} to="/">
                <img alt="logo" src={logo} height="30px" />
              </Link>
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
              {auth && !userOwnRelayer && <Button component={AdapterLink} to="/register">Start a Relayer</Button>}
              {auth && <UserMenu />}
              {!auth && <Button variant="contained" component={AdapterLink} to="/login">Login</Button>}
              {!auth && <Link component={AdapterLink} to="/login" className="ml-3">Help</Link>}
            </Grid>
          </Grid>
        </Container>
      </Box>
    )
  }
}

export default PageHeader
