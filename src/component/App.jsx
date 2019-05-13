import React from 'react'
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom'
import Authentication from 'component/route/Authentication'
import Main from 'component/route/Main'
import Register from 'component/route/Register'
import PageHeader from 'component/shared/PageHeader'
import { SITE_MAP } from 'service/constant'
import 'style/app.scss'

const Router = process.env.STG === 'production' ? BrowserRouter : HashRouter

const App = () => (
  <Router>
    <Switch>
      <Route path={SITE_MAP.Authentication} component={Authentication} />
      <Route path={SITE_MAP.Home} render={props => (
        <div>
          <PageHeader />
          <Switch>
            <Route path={SITE_MAP.Register} component={Register} />
            <Route path={SITE_MAP.Home} exact component={Main} />
          </Switch>
        </div>
      )} />
    </Switch>
  </Router>
)

export default App
