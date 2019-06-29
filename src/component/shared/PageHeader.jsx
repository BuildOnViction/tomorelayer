import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { Link } from 'react-router-dom'
import {
  Button,
  Container,
  Grid,
  TextField,
} from '@material-ui/core'
import { AdapterLink } from './Adapters'
import { UserMenu, RelayerMenu } from './Menus'
import logo from 'asset/app-logo.png'

class PageHeader extends React.Component {

  render() {

    const {
      auth,
      userRelayers,
    } = this.props

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
              {auth && userRelayers.length > 0 && <RelayerMenu relayers={userRelayers} />}
              {auth && userRelayers.length === 0 && <Button component={AdapterLink} to="/register">Start a Relayer</Button>}
              {auth && <UserMenu />}
              {!auth && <Button component={AdapterLink} to="/login">Login</Button>}
            </Grid>
          </Grid>
        </Container>
      </div>
    )
  }
}

const mapProps = state => ({
  auth: state.auth,
  userRelayers: Object.values(state.derived.userRelayers || {}).map(r => ({ coinbase: r.coinbase, name: r.name })),
})

const actions = store => ({
})

export default connect(mapProps, actions)(PageHeader)
