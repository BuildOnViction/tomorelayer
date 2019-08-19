import React from 'react'
import { connect } from 'redux-zero/react'
import {
  Box,
  Container,
  Grid,
  Link,
  // Switch,
  Hidden,
  withWidth,
} from '@material-ui/core'
import {
  isEmpty,
} from 'service/helper'
import {
  FuzzySearch,
} from 'service/frontend'
import {
  UserMenu,
  RelayerMenu,
  StartRelayerButton,
  ResponsiveMenu,
} from './Menus'
import { AdapterLink } from './Adapters'
import logo from 'asset/logo-tomorelayer.svg'
import PageSearch, { PageSearchResponsive } from './PageSearch'

const ref = React.createRef()
class PageHeader extends React.Component {

  state = {
    searchResult: []
  }

  pouchQuery = async e => {
    const value = e.target.value
    const searchResult = await FuzzySearch(this.props.pouch, value)
    this.setState({ searchResult })
    console.log(searchResult)
  }

  render() {

    const {
      user,
      relayers,
      pouch,
      /* changeTheme,
       * activeTheme, */
    } = this.props

    const { searchResult } = this.state

    const auth = Boolean(user.wallet)
    const userOwnRelayer = !isEmpty(relayers)

    return (
      <Box className="tomo-header">
        <Container maxWidth="lg" className="p-1">
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item xs={3} md={2}>
              <img alt="logo" src={logo} height="30px" />
              {/* <Link display="block" component={AdapterLink} to="/">
                  <img alt="logo" src={logo} height="30px" />
                  </Link> */}
            </Grid>
            <Hidden smDown>
              <Grid item md={6}>
                <PageSearch onChange={this.pouchQuery} searchResult={searchResult} disabled={!Boolean(pouch)} />
              </Grid>
            </Hidden>
            <Grid item xs={9} md={4} container justify="flex-end" direction="row" spacing={4} alignItems="center">
              <Hidden smDown>
                {auth && userOwnRelayer && <RelayerMenu relayers={relayers} />}
                {auth && !userOwnRelayer && <StartRelayerButton />}
                {auth && <UserMenu />}
              </Hidden>

              <Hidden mdUp>
                <PageSearchResponsive onChange={this.pouchQuery} searchResult={searchResult} disabled={!Boolean(pouch)} />
                {auth && userOwnRelayer && <ResponsiveMenu ref={ref} relayers={relayers} userOwnRelayer={userOwnRelayer}></ResponsiveMenu>}
              </Hidden>  
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
  pouch: state.pouch,
})

const actions = {
  changeTheme: (state) => ({
    activeTheme: state.activeTheme === 'light' ? 'dark' : 'light'
  }),
}

const PageHeaderResponsive = withWidth()(PageHeader)

export default connect(mapProps, actions)(PageHeaderResponsive)
