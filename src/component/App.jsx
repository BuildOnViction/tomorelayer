import React from 'react'
import { BrowserRouter, HashRouter, Switch } from 'react-router-dom'
import Authentication from 'component/route/Authentication'
import { Private } from 'component/utility'
import { SITE_MAP } from 'service/constant'
import 'style/app.scss'

const Router = process.env.STG === 'production' ? BrowserRouter : HashRouter

const App = () => (
  <Router>
    <Switch>
      <Private path={SITE_MAP.Authentication} component={Authentication} />
      <Private path={SITE_MAP.Home} component={() => (
        <div className="col-auto align-self-stretched pt-3">
          private
        </div>
      )} />
    </Switch>
  </Router>
)

export default App
