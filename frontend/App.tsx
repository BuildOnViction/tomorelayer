import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { Private } from '@shared'
import { SITE_MAP } from '@constant'
import Home from '@route/home'
import Dashboard from '@route/dashboard'

import './style/app.scss'
import './static/favicon.ico'

const App = () => (
  <Router>
    <Switch>
      <Route exact path={SITE_MAP.root} component={Home} />
      <Private path={SITE_MAP.dashboard} component={Dashboard} auth />
    </Switch>
  </Router>
)

export default App
