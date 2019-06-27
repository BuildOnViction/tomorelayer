import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom'
import { SITE_MAP, IS_DEV } from 'service/constant'
import { PushAlert, AlertVariant } from 'service/frontend'
import { Protected } from 'component/utility'

import PageHeader from 'component/shared/PageHeader'
import Alert from 'component/shared/Alert'

import Authentication from 'component/route/Authentication'
import Main from 'component/route/Main'
import Dashboard from 'component/route/Dashboard'
import Register from 'component/route/Register'
import Logout from 'component/route/Logout'


import {
  AutoAuthenticated,
  FetchContract,
  FetchRelayers,
  FetchTokens,
} from './shared/actions'

import 'style/app.scss'

const Router = IS_DEV ? HashRouter : BrowserRouter

class App extends React.Component {

  async componentDidMount() {
    const errorAlert = message => this.props.PushAlert({ message, variant: AlertVariant.error })
    const successAlert = message => this.props.PushAlert({ message, variant: AlertVariant.success })

    try {
      await this.props.FetchRelayers()
      successAlert('fetched relayers')

      await this.props.FetchContract()
      successAlert('fetched contracts')

      await this.props.FetchTokens()
      successAlert('fetched tokens')

      this.props.AutoAuthenticated()
    } catch (error) {
      errorAlert(error)
    }
  }

  render() {

    const {
      authorized,
    } = this.props

    return (
      <Router>
        <Switch>
          <Route path={SITE_MAP.Authentication} component={Authentication} />
          <Route path={SITE_MAP.Home} render={() => (
            <div>
              <PageHeader />
              <Alert />
              <Switch>
                <Route path={SITE_MAP.Home} exact component={Main} />
                <Protected path={SITE_MAP.Register} component={Register} condition={authorized} redirect={SITE_MAP.Authentication} />
                <Protected path={SITE_MAP.Dashboard} component={Dashboard} condition={authorized} redirect={SITE_MAP.Authentication} />
                <Route path={SITE_MAP.Logout} component={Logout} />
              </Switch>
            </div>
          )} />
        </Switch>
      </Router>
    )
  }
}

const mapProps = state => ({
  relayers: state.Relayers,
  authorized: state.auth,
})

const actions = {
  AutoAuthenticated,
  FetchContract,
  FetchRelayers,
  FetchTokens,
  PushAlert,
}

export default connect(mapProps, actions)(App)
