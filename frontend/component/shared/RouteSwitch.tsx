import { Link } from 'react-router-dom'
import { Card, Elevation } from '@blueprintjs/core'
import { Grid } from '@utility'
import { SITE_MAP } from '@constant'


export const RouteSwitch = () => (
  <Grid className="justify-space-between">
    {Object.keys(SITE_MAP).map(route => (
      <div className="col-2" key={route}>
        <Card
          interactive
          elevation={Elevation.ONE}
        >
          <h5>
            <Link to={SITE_MAP[route]}>
              {route}
            </Link>
          </h5>
          <div>Card content</div>
        </Card>
      </div>
    ))}
  </Grid>
)
