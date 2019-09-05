import React from 'react'
import { Switch, Redirect, Route, withRouter } from 'react-router'
import { connect } from 'redux-zero/react'
import { Box } from '@material-ui/core'
import { SITE_MAP } from 'service/constant'
import { compose } from 'service/helper'
import TabMenu from './TabMenu'
import RelayerStat from './RelayerStat'
import RelayerConfig from './RelayerConfig'
import FeedBack from './FeedBack'

const baseUrl = SITE_MAP.Dashboard

const Dashboard = ({
  relayers,
  match,
}) => {

  const firstRelayer = relayers[0]

  const ExactPathRender = () => firstRelayer ? (
    <Redirect to={`${baseUrl}/${firstRelayer.coinbase}`} />
  ) : (
    <Redirect to={SITE_MAP.Register} />
  )

  const SafePath = (Component) => props => Object.keys(relayers).includes(props.match.params.coinbase) ? (
    <Component
      relayer={relayers[props.match.params.coinbase]}
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
          <Route
            path={`${baseUrl}/:coinbase/feedback`}
            render={SafePath(FeedBack)}
          />
        </Switch>
      </Box>
    </Box>
  )
}

const mapProps = state => ({
  relayers: state.user.relayers
})

export default compose(
  connect(mapProps),
  withRouter,
)(Dashboard)
