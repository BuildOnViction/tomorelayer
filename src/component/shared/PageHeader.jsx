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
    searchResult: [],
    address: undefined,
    userAddress: undefined
  }

  async componentDidUpdate(prevProps) {
    if (!prevProps.user.wallet && this.props.user.wallet) {
      const address = await this.props.user.wallet.getAddress()
      const fixedAddr = address.slice(0, 5) + ' ... ' + address.slice(-4)
      this.setState({ address: fixedAddr })
      this.setState({ userAddress: address})
    }
    let pouch = this.props.pouch
    let relayers = this.props.relayers

    if (pouch) {
      pouch.changes({
        filter: function (doc) {
          return doc.type === 'relayer'
        }}
      ).on('change', async (data) => {
        let r = await pouch.get(data.id) 
        if (relayers[r.coinbase] && (this.state.userAddress.toLowerCase() === r.owner.toLowerCase())) {
          Object.keys(relayers).forEach(k => {
            if (relayers[k].coinbase === r.coinbase) {
              relayers[k] = r
            }
          })
        }
      })
    }


  }

  pouchQuery = async e => {
    const value = e.target.value
    const searchResult = await FuzzySearch(this.props.pouch, value)
    this.setState({ searchResult })
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
        <Container maxWidth="lg" style={{ padding: 12 }}>
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item xs={3} md={2}>
              <Link display="block" component={AdapterLink} to="/">
                <img alt="logo" src={logo} height="30px" />
              </Link>
            </Grid>
            <Hidden smDown>
              <Grid item md={6}>
                <PageSearch
                  onChange={this.pouchQuery}
                  searchResult={searchResult}
                  disabled={!Boolean(pouch)}
                />
              </Grid>
            </Hidden>
            <Grid item xs={9} md={4} container justify="flex-end" direction="row" spacing={4} alignItems="center">
              <Hidden smDown>
                {auth && userOwnRelayer && <RelayerMenu relayers={relayers} />}
                {auth && !userOwnRelayer && <StartRelayerButton />}
                {auth && <UserMenu address={this.state.address} />}
              </Hidden>

              <Hidden mdUp>
                <PageSearchResponsive
                  onChange={this.pouchQuery}
                  searchResult={searchResult}
                  disabled={!Boolean(pouch)}
                />
                {auth && userOwnRelayer && (
                  <ResponsiveMenu
                    ref={ref}
                    relayers={relayers}
                    userOwnRelayer={userOwnRelayer}
                    address={this.state.address}
                  />
                )}
              </Hidden>
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
