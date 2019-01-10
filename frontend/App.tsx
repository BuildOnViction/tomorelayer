import { Route, BrowserRouter, HashRouter, Switch } from 'react-router-dom'
import { SITE_MAP } from '@constant'
import Home from '@route/home'
import Dashboard from '@route/dashboard'

import NavBar from '@shared/NavBar'
import './style/collection/app.scss'
import './static/favicon.ico'

const Router = process.env.STG === 'production' ? BrowserRouter : HashRouter

const App = () => (
  <Router>
    <div>
      <NavBar />
      <Switch>
        <Route exact path={SITE_MAP.root} component={Home} />
        <Route path={SITE_MAP.dashboard} component={Dashboard} />
      </Switch>
    </div>
  </Router>
)

export default App
