import React from 'react'
import { Switch, Route } from 'react-router'
import { connect } from '@vutr/redux-zero/react'
import { Container, Box } from '@material-ui/core'
import TabMenu from './TabMenu'
import RelayerStat from './RelayerStat'
import RelayerConfig from './RelayerConfig'

class Dashboard extends React.Component {
  render() {
    return (
      <Container maxWidth="lg">
        <TabMenu />
        <Box>
          <Switch>
            <Route path="/dashboard/" exact component={RelayerStat}/>
            <Route path="/dashboard/config" component={RelayerConfig}/>
          </Switch>
        </Box>
      </Container>
    )
  }
}

const mapProps = state => ({
  relayerId: state.User.activeRelayer.id
})

const storeConnect = connect(mapProps)

export default storeConnect(Dashboard)
