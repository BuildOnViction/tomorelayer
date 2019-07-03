import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom'
import { SITE_MAP, IS_DEV } from 'service/constant'
import { PushAlert, AlertVariant } from 'service/frontend'
import * as _ from 'service/helper'
import RelayerContractClass from 'service/relayer_contract'
import { FetchPublic } from './shared/actions'
import { Protected } from 'component/utility'

import PageHeader from 'component/shared/PageHeader'
import Alert from 'component/shared/Alert'
import Authentication from 'component/route/Authentication'
import Main from 'component/route/Main'
import Dashboard from 'component/route/Dashboard'
import Register from 'component/route/Register'
import Logout from 'component/route/Logout'

import 'style/app.scss'


const Router = IS_DEV ? HashRouter : BrowserRouter


class App extends React.Component {

  state = {
    userRelayers: {}
  }

  async componentDidMount() {
    try {
      await this.props.FetchPublic()
    } catch (error) {
      console.erro(error)
      this.props.PushAlert({
        message: 'Cannot fetch public resources',
        variant: AlertVariant.error,
      })
    }
  }

  async componentDidUpdate(prevProps) {
    const {
      RelayerContract,
      contract,
      user,
      relayers,
      shouldUpdateUserRelayers,
      finishUpdateUserRelayers,
      initRelayerContract,
    } = this.props

    const relayersJustFetched = relayers.length && !prevProps.relayers.length
    const userJustLoggedIn = user.wallet && !prevProps.user.wallet

    const shouldFilterUserRelayer = (relayersJustFetched && user.wallet) || (userJustLoggedIn && relayers.length > 0)

    if (shouldFilterUserRelayer || shouldUpdateUserRelayers) {
      const userAddress = await user.wallet.getAddress()
      const userRelayers = {}
      relayers.filter(r => _.compareString(r.owner, userAddress)).forEach(r => {
        userRelayers[r.coinbase] = r
      })
      this.setState({ userRelayers }, () => finishUpdateUserRelayers())
    }

    if (!RelayerContract && user.wallet && contract) {
      const contractInstance = new RelayerContractClass(user.wallet, contract)
      initRelayerContract(contractInstance)
    }
  }

  render() {

    const x= 'shit'

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
                <Protected
                  path={SITE_MAP.Logout}
                  condition={userLoggedIn}
                  redirect={SITE_MAP.Home}
                  component={Logout}
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
  contract: state.Contracts.find(r => r.name === 'RelayerRegistration' && !r.obsolete),
  shouldUpdateUserRelayers: state.shouldUpdateUserRelayers,
  RelayerContract: state.blk.RelayerContract,
})

const actions = {
  FetchPublic,
  PushAlert,
  finishUpdateUserRelayers: () => ({ shouldUpdateUserRelayers: false }),
  initRelayerContract: (state, RelayerContract) => ({
    blk: {
      ...state.blk,
      RelayerContract,
    }
  })
}

export default connect(mapProps, actions)(App)
