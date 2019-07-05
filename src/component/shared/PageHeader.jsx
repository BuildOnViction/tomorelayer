import React from 'react'
import {
  Button,
  Container,
  Grid,
  Link,
  TextField,
} from '@material-ui/core'
import * as _ from 'service/helper'
import { AdapterLink } from './Adapters'
import { UserMenu, RelayerMenu } from './Menus'
import logo from 'asset/app-logo.png'

class PageHeader extends React.Component {

  render() {

    const {
      user,
      relayers,
    } = this.props

    const auth = Boolean(user.wallet)
    const userOwnRelayer = !_.isEmpty(relayers)

    return (
      <div style={{ background: 'white' }}>
        <Container maxWidth="md" className="p-1 mb-1">
          <Grid container direction="row" justify="space-between" alignItems="center" spacing={4}>
            <Grid item sm={3} md={2}>
              <Link to="/">
                <img alt="logo" src={logo} height="40" />
              </Link>
            </Grid>
            <Grid item sm={false} md={6}>
              <TextField placeholder="Search..." fullWidth variant="outlined" margin="dense" />
            </Grid>
            <Grid item sm={6} md={4} container justify="space-around" direction="row" spacing={4}>
              {auth && userOwnRelayer && <RelayerMenu relayers={relayers} />}
              {auth && !userOwnRelayer && <Button component={AdapterLink} to="/register">Start a Relayer</Button>}
              {auth && <UserMenu />}
              {!auth && <Button variant="contained" component={AdapterLink} to="/login">Login</Button>}
              {!auth && <Link component={AdapterLink} to="/login">Help</Link>}
            </Grid>
          </Grid>
        </Container>
      </div>
    )
  }
}

export default PageHeader
