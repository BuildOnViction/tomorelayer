import { Route, BrowserRouter, HashRouter, Switch } from 'react-router-dom'
import { SITE_MAP } from '@constant'
import { Authentication, Dashboard, Home, Relayers, Registration } from '@route'
import { NavBar, RouteSwitch } from '@shared'
import { Container, Grid, Private } from '@utility'
import { APP_INITIALIZER } from '@action'
import '@static/favicon.ico'
import '../style/app.scss'

const Router = process.env.STG === 'production' ? BrowserRouter : HashRouter

const App = () => (
  <Router>
    <Grid className="stretched main">
      <Switch>
        <Private path={SITE_MAP.Authentication} component={Authentication} />
        <Route path={SITE_MAP.Home} render={() => (
          <React.Fragment>
            <NavBar />
            <div className="col-auto align-self-stretched pt-3">
              <Switch>
                <Private exact path={SITE_MAP.Home} component={Home} />
                <Private path={SITE_MAP.Dashboard} component={Dashboard} />
                <Private path={SITE_MAP.Registration} component={Registration} />
                <Private path={SITE_MAP.Relayers} component={Relayers} />
              </Switch>
            </div>
          </React.Fragment>
        )} />
      </Switch>
    </Grid>
  </Router>
)

export default App
