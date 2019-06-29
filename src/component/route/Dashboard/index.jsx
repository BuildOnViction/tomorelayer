import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { Switch, Redirect, Route } from 'react-router'
import { Container, Box } from '@material-ui/core'
import TabMenu from './TabMenu'
import RelayerStat from './RelayerStat'
import RelayerConfig from './RelayerConfig'

class Dashboard extends React.Component {
  render() {

    const {
      relayers,
    } = this.props

    const ExactPathRender = () => relayers[0] ? (
      <Redirect path={`/dashboard/${relayers[0].coinbase}`} />
    ) : (
      <Redirect path="/register" />
    )

    return (
      <Container maxWidth="lg">
        <TabMenu />
        <Box>
          <Switch>
            <Route path="/dashboard" exact render={ExactPathRender} />
            <Route path="/dashboard/:coinbase" exact component={RelayerStat}/>
            <Route path="/dashboard/:coinbase/config" component={RelayerConfig}/>
          </Switch>
        </Box>
      </Container>
    )
  }
}

const mapProps = state => ({
  relayers: state.derived.userRelayers
})

const storeConnect = connect(mapProps)

export default storeConnect(Dashboard)
