import { Link } from 'react-router-dom'
import { Card, Elevation } from '@blueprintjs/core'
import { Container, Grid } from '@utility'
import { SITE_MAP } from '@constant'


export const RouteSwitch = () => (
  <Container full>
    <Grid className="justify-space-between">
      {Object.keys(SITE_MAP).map(route => (
        <Card
          interactive
          key={route}
          elevation={Elevation.ONE}
          className="col-2"
        >
          <h5>
            <Link to={SITE_MAP[route]}>
              {route}
            </Link>
          </h5>
          <div>Card content</div>
        </Card>
      ))}
    </Grid>
  </Container>
)
