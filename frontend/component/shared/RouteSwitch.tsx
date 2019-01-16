import _ from 'rambda'
import cx from 'classnames'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import { Grid } from '@utility'
import { SITE_MAP } from '@constant'

const cls = active => cx('col-auto route-switch--route m-1', { active, 'drop-shadow': active })

const WrappedRouteSwitch = ({ history, registeredRelayers, currentUser }) => {
  const activeRoute = history.location.pathname
  const addresses = _.pluck('address', registeredRelayers)
  const isRegistered = currentUser !== '' && registeredRelayers.length > 0 && currentUser in addresses
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
  registeredRelayers: store.relayers,
  currentUser: store.currentUserAddress,
})

const connector = _.compose(
  withRouter,
  connect(mapProps),
)

export const RouteSwitch = connector(WrappedRouteSwitch)
