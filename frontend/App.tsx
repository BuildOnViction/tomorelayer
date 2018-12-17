import React from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import Home from './component/route/home'
import Dashboard from './component/route/dashboard'
import { Private } from './component/shared'
import { SITE_MAP } from './service/constant'

import './style/app.scss'

const App = () => (
  <Router>
    <Switch>
      <Route exact path={SITE_MAP.root} component={Home} />
      <Private path={SITE_MAP.dashboard} component={Dashboard} auth />
    </Switch>
  </Router>
)

export default App
