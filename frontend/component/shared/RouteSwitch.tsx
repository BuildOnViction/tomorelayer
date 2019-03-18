import * as _ from 'lodash/fp'
import cx from 'classnames'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import { Grid } from '@utility'
import { SITE_MAP } from '@constant'

const cls = active => cx('col-auto route-switch--route m-1', { active, 'drop-shadow': active })

const WrappedRouteSwitch = ({ history, relayers, currentUser }) => {
  const activeRoute = history.location.pathname
  const addresses = _.pluck('address', relayers)
  const isRegistered = currentUser !== '' && relayers.length > 0 && addresses.indexOf(currentUser) > -1
  const availableRoutes = Object.keys(SITE_MAP).filter(r => isRegistered ? r !== 'Registration' : r !== 'Dashboard')
  return (
    <Grid className="route-switch mt-1 mb-1">
      {availableRoutes.map(route => (
        <Link
          to={SITE_MAP[route]}
          className={cls(activeRoute === SITE_MAP[route])}
          key={route}
          >
          <div className="text-center">
            {route}
          </div>
        </Link>
      ))}
    </Grid>
  )
}

const mapProps = store => ({
  relayers: store.relayers,
  currentUser: store.currentUserAddress,
})

const connector = _.compose(
  withRouter,
  connect(mapProps),
)

export const RouteSwitch = connector(WrappedRouteSwitch)
