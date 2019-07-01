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
import { FetchPublic } from './shared/actions'
import 'style/app.scss'


const Router = IS_DEV ? HashRouter : BrowserRouter


class App extends React.Component {

  state = {
    userRelayers: {}
  }

  async componentDidMount() {
    const errorAlert = message => this.props.PushAlert({ message, variant: AlertVariant.error })
    const successAlert = message => this.props.PushAlert({ message, variant: AlertVariant.success })

    try {
      await this.props.FetchPublic()
      successAlert('fetched all resources')

      // this.props.AutoAuthenticated()
    } catch (error) {
      errorAlert(error)
    }
  }

  async componentDidUpdate(prevProps) {
    const relayersJustFetched = this.props.relayers.length && !prevProps.relayers.length
    const userJustLoggedIn = this.props.user.wallet && !prevProps.user.wallet

    const shouldFilterUserRelayer = (relayersJustFetched && this.props.user.wallet) || (userJustLoggedIn && this.props.relayers.length)

    if (shouldFilterUserRelayer) {
      const userAddress = await this.props.user.wallet.getAddress()
      const userRelayers = {}
      this.props.relayers.filter(r => r.owner === userAddress).forEach(r => {
        userRelayers[r.coinbase] = r
      })
      this.setState({ userRelayers })
    }
  }

  render() {

    const {
      userRelayers,
    } = this.state

    const {
      user,
    } = this.props

    const userLoggedIn = Boolean(user.wallet)

    return (
      <Router>
        <Switch>
          <Route path={SITE_MAP.Authentication} component={Authentication} />
          <Route path={SITE_MAP.Home} render={() => (
            <div>
              <PageHeader relayers={userRelayers} user={user} />
              <Alert />
              <Switch>
                <Route path={SITE_MAP.Home} exact component={Main} />
                <Protected
                  path={SITE_MAP.Register}
                  component={Register}
                  condition={userLoggedIn}
                  redirect={SITE_MAP.Authentication}
                />
                <Protected
                  path={SITE_MAP.Dashboard}
                  render={() => <Dashboard relayers={userRelayers} /> }
                  condition={userLoggedIn}
                  redirect={SITE_MAP.Authentication}
                />
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
  user: state.user,
})

const actions = {
  FetchPublic,
  PushAlert,
}

export default connect(mapProps, actions)(App)
