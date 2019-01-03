import React from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import { SITE_MAP } from '@constant'
import Home from '@route/home'
import Dashboard from '@route/dashboard'

import './style/app.scss'
import './static/favicon.ico'

const App = () => (
  <Router>
    <Switch>
      <Route exact path={SITE_MAP.root} component={Home} />
      <Route path={SITE_MAP.dashboard} component={Dashboard} />
    </Switch>
  </Router>
)

export default App
