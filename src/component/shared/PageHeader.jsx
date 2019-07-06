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
        <Container maxWidth="lg" className="p-1 mb-1">
          <Grid container direction="row" justify="space-between" alignItems="center" spacing={4}>
            <Grid item sm={12} md={6}>
              <Box display="flex" justifyContent="start" alignItems="center">
                <Link display="block" component={AdapterLink} to="/" className="mr-2">
                  <img alt="logo" src={logo} />
                </Link>
                <TextField
                  placeholder="Search..."
                  fullWidth
                  variant="outlined"
                  margin="dense"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
            </Grid>
            <Grid item sm={6} md={4} container justify="space-around" direction="row" spacing={4} alignItems="center">
              {auth && userOwnRelayer && <RelayerMenu relayers={relayers} />}
              {auth && !userOwnRelayer && <Button component={AdapterLink} to="/register">Start a Relayer</Button>}
              {auth && <UserMenu />}
              {!auth && <Button variant="contained" component={AdapterLink} to="/login">Login</Button>}
              {!auth && <Link component={AdapterLink} to="/login">Help</Link>}
            </Grid>
          </Grid>
        </Container>
      </Box>
    )
  }
}

export default PageHeader
