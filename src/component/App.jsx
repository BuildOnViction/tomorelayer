import React from 'react'
import { connect } from 'redux-zero/react'
import { BrowserRouter, HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import Authentication from 'component/route/Authentication'
import Main from 'component/route/Main'
import Dashboard from 'component/route/Dashboard'
import Register from 'component/route/Register'
import PageHeader from 'component/shared/PageHeader'
import { Private } from 'component/utility'
import { SITE_MAP } from 'service/constant'
import { $fetchRelayers } from './actions'
import 'style/app.scss'

const Router = process.env.STG === 'production' ? BrowserRouter : HashRouter

class App extends React.Component {

  async componentDidMount() {
    this.props.$fetchRelayers()
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
                <Route path={SITE_MAP.Dashboard} exact render={() => <Redirect to={SITE_MAP.Dashboard + '/0'} />} />
                <Private path={SITE_MAP.Dashboard + '/:relayerIdx'} component={Dashboard} />
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

export default connect(mapProps, { $fetchRelayers })(App)
