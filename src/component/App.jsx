import React from 'react'
import { BrowserRouter, HashRouter, Switch } from 'react-router-dom'
import Authentication from 'component/route/Authentication'
import Main from 'component/route/Main'
import { Private } from 'component/utility'
import { SITE_MAP } from 'service/constant'
import 'style/app.scss'

const Router = process.env.STG === 'production' ? BrowserRouter : HashRouter

const App = () => (
  <Router>
    <Switch>
      <Private path={SITE_MAP.Authentication} component={Authentication} />
      <Private path={SITE_MAP.Home} component={Main} />
    </Switch>
  </Router>
)

export default App
