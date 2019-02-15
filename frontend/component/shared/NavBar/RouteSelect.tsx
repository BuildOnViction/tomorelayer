import { Link, withRouter } from 'react-router-dom'
import { SITE_MAP } from '@constant'


const RouteSelect = withRouter(({ history }) => {
  const activeRoute = history.location.pathname
  const isActiveRoute = route => activeRoute === SITE_MAP[route] ? 'nav-menu__item--active' : ''
  return (
    <div className="nav-menu">
      <ul className="nav-menu__list pl-0">
        {Object.keys(SITE_MAP).map(route => (
          <li key={route} className={`pl-2 nav-menu__item ${isActiveRoute(route)}`}>
            <Link to={SITE_MAP[route]}>
              <i className={`icon-${route.toLowerCase()}`} />
              <div className="hidden-xs hidden-xxs inline">
                {route}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
})

export default RouteSelect
