import React from 'react'
import { hot } from 'react-hot-loader/root'
import { connect } from 'redux-zero/react'
import { BrowserRouter, HashRouter, Switch } from 'react-router-dom'
import { Container } from '@material-ui/core'
import { SITE_MAP, IS_DEV } from 'service/constant'
import * as _ from 'service/helper'
import { AppInitialization } from './shared/actions'
import { Protected, MainAppLoader } from 'component/utility'
import PageHeader from 'component/shared/PageHeader'
import PageFooter from 'component/shared/PageFooter'
import Alert from 'component/shared/Alert'
import Authentication from 'component/route/Authentication'
import Home from 'component/route/Home'
import Profile from 'component/route/Profile'
import Dashboard from 'component/route/Dashboard'
import Register from 'component/route/Register'
import Logout from 'component/route/Logout'

import 'style/app.scss'


const Router = IS_DEV ? HashRouter : BrowserRouter


class App extends React.Component {

  state = {
    publicFetchLoading: true,
  }

  async componentDidMount() {
    await this.props.AppInitialization()
    this.setState({ publicFetchLoading: false })
  }

  render() {

    const {
      publicFetchLoading,
    } = this.state

    const {
      user,
      userRelayers,
    } = this.props

    const userLoggedIn = Boolean(user.wallet)

    if (publicFetchLoading) {
      return (
        <Router>
          <div>
            <PageHeader relayers={userRelayers} user={user} />
            <MainAppLoader />
          </div>
        </Router>
      )
    }

    let authenticateRedirect = SITE_MAP.Register
    let dashboardRedirect = SITE_MAP.Authentication

    if (userLoggedIn) {
      dashboardRedirect = userRelayers[0] ? `${SITE_MAP.Dashboard}/${userRelayers[0].coinbase}` : SITE_MAP.Register
    }

    if (userRelayers[0]) {
      const firstCoinbase = userRelayers[0].coinbase
      authenticateRedirect = `${SITE_MAP.Dashboard}/${firstCoinbase}`
    }

    return (
      <Router>
        <div>
          <PageHeader relayers={userRelayers} user={user} />
          <Alert />
          <Container className="maincontent" maxWidth="lg">
            <Switch>
              <Protected
                path={SITE_MAP.Home}
                exact
                component={Home}
                redirect={SITE_MAP.Authentication}
                condition={false}
              />
              <Protected
                path={SITE_MAP.Authentication}
                component={Authentication}
                condition={!userLoggedIn}
                redirect={authenticateRedirect}
              />
              <Protected
                path={SITE_MAP.Profile}
                component={props => <Profile relayers={userRelayers} user={user} {...props} />}
                condition={userLoggedIn}
                redirect={SITE_MAP.Authentication}
              />
              <Protected
                path={SITE_MAP.Register}
                component={Register}
                condition={userLoggedIn}
                redirect={SITE_MAP.Authentication}
              />
              <Protected
                path={SITE_MAP.Dashboard}
                condition={false}
                redirect={dashboardRedirect}
                exact
              />
              <Protected
                path={`${SITE_MAP.Dashboard}/:coinbase`}
                component={Dashboard}
                condition={userLoggedIn && !_.isEmpty(userRelayers)}
                redirect={dashboardRedirect}
              />
              <Protected
                path={SITE_MAP.Logout}
                component={Logout}
                condition={userLoggedIn}
                redirect={SITE_MAP.Authentication}
              />
            </Switch>
          </Container>
          <PageFooter />
        </div>
      </Router>
    )
  }
}

const mapProps = state => ({
  user: state.user,
  userRelayers: state.user.relayers,
})

const actions = {
  AppInitialization,
}

const ConnectedApp = connect(mapProps, actions)(App)

export default process.env.NODE_ENV in ['production', 'test'] ? ConnectedApp : hot(ConnectedApp)
