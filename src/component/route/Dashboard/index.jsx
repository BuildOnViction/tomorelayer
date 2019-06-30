import React from 'react'
import { Switch, Redirect, Route } from 'react-router'
import { Container, Box } from '@material-ui/core'
import { SITE_MAP } from 'service/constant'
import TabMenu from './TabMenu'
import RelayerStat from './RelayerStat'
import RelayerConfig from './RelayerConfig'

class Dashboard extends React.Component {
  render() {

    const baseUrl = SITE_MAP.Dashboard

    const {
      relayers,
    } = this.props

    const firstRelayer = Object.values(relayers)[0]

    const ExactPathRender = () => firstRelayer ? (
      <Redirect path={`${baseUrl}/${firstRelayer.coinbase}`} />
    ) : (
      <Redirect path={SITE_MAP.Register} />
    )

    return (
      <Container maxWidth="lg">
        <TabMenu />
        <Box>
          <Switch>
            <Route path={baseUrl} exact render={ExactPathRender} />
            <Route
              path={`${baseUrl}/:coinbase`}
              exact
              render={props => <RelayerStat relayers={relayers} {...props} />}
            />
            <Route
              path={`${baseUrl}/:coinbase/config`}
              render={props => <RelayerConfig relayers={relayers} {...props} />}
            />
          </Switch>
        </Box>
      </Container>
    )
  }
}

export default Dashboard
