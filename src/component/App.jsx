import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom'
import Authentication from 'component/route/Authentication'
import Main from 'component/route/Main'
import Dashboard from 'component/route/Dashboard'
import Register from 'component/route/Register'
import PageHeader from 'component/shared/PageHeader'
import { Private } from 'component/utility'
import { SITE_MAP, isDev } from 'service/constant'
import { $autoAuthenticated, $fetchRelayers } from './shared/actions'
import 'style/app.scss'

const Router = !isDev ? BrowserRouter : HashRouter

class App extends React.Component {

  componentDidMount() {
    this.props.$fetchRelayers()
    this.props.$autoAuthenticated()
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path={SITE_MAP.Authentication} component={Authentication} />
          <Route path={SITE_MAP.Home} render={() => (
            <div>
              <PageHeader />
              <Switch>
                <Private path={SITE_MAP.Register} component={Register} />
                <Route path={SITE_MAP.Home} exact component={Main} />
                <Private path={SITE_MAP.Dashboard} component={Dashboard} />
              </Switch>
            </div>
          )} />
        </Switch>
      </Router>
    )
  }
}

const mapProps = state => ({
  relayers: state.Relayers
})

export default connect(mapProps, { $autoAuthenticated, $fetchRelayers })(App)
