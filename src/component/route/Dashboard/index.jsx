import React from 'react'
import { Switch, Redirect, Route } from 'react-router'
import { connect } from 'redux-zero/react'
import { Box } from '@material-ui/core'
import { SITE_MAP } from 'service/constant'
import TabMenu from './TabMenu'
import RelayerStat from './RelayerStat'
import RelayerConfig from './RelayerConfig'

class Dashboard extends React.Component {
  state = {
    loading: true,
  }

  async componentDidUpdate(prevProps) {
    if (!this.props.match) {
      return
    }

    const coinbase = this.props.match.params.coinbase
    const prevCoinbase = prevProps.match.params.coinbase

    if (coinbase !== prevCoinbase) {
      return
    }
  }

  render() {

    const baseUrl = SITE_MAP.Dashboard

    const {
      relayers,
    } = this.props

    const {
      loading,
    } = this.state

    const firstRelayer = Object.values(relayers).sort((a,b) => a.name.localeCompare(b.name))[0]

    const ExactPathRender = () => firstRelayer ? (
      <Redirect to={`${baseUrl}/${firstRelayer.coinbase}`} />
    ) : (
      <Redirect to={SITE_MAP.Home} />
    )

    const SafePath = (Component) => props => Object.keys(relayers).includes(props.match.params.coinbase) ? (
      <Component
        relayer={relayers[props.match.params.coinbase]}
        loading={loading}
        {...props}
      />
    ) : (
      <Redirect to={SITE_MAP.Dashboard} />
    )

    return (
      <Box style={{ transform: 'translateY(-30px)' }}>
        <TabMenu />
        <Box className="mt-2">
          <Switch>
            <Route path={baseUrl} exact render={ExactPathRender} />
            <Route
              path={`${baseUrl}/:coinbase`}
              exact
              render={SafePath(RelayerStat)}
            />
            <Route
              path={`${baseUrl}/:coinbase/config`}
              render={SafePath(RelayerConfig)}
            />
          </Switch>
        </Box>
      </Box>
    )
  }
}

const mapProps = state => ({})

const actions = {

}

export default connect(mapProps, actions)(Dashboard)
