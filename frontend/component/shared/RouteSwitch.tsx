import cx from 'classnames'
import { Link, withRouter } from 'react-router-dom'
import { Grid } from '@utility'
import { SITE_MAP } from '@constant'

const cls = active => cx('col-auto route-switch--route m-1', { active, 'drop-shadow': active })

export const RouteSwitch = withRouter(({ history }) => {
  const activeRoute = history.location.pathname
  return (
    <Grid className="route-switch mt-1 mb-1">
      {Object.keys(SITE_MAP).filter(r => r !== 'Auth').map(route => (
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
})
