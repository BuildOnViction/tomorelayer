import React from 'react'
import { connect } from 'redux-zero/react'
import { BrowserRouter, HashRouter, Switch, Route } from 'react-router-dom'
import Authentication from 'component/route/Authentication'
import Main from 'component/route/Main'
import Register from 'component/route/Register'
import PageHeader from 'component/shared/PageHeader'
import { SITE_MAP, API } from 'service/constant'
import { Client } from 'service/action'
import 'style/app.scss'

const Router = process.env.STG === 'production' ? BrowserRouter : HashRouter

class App extends React.Component {
  async componentDidMount() {
    const resp = await Client.get(API.relayer)
    this.props.$fetchRelayers(resp.payload)
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
                <Route path={SITE_MAP.Register} component={Register} />
                <Route path={SITE_MAP.Home} exact component={Main} />
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

const actions = store => ({
  $fetchRelayers: (store, Relayers) => ({ Relayers })
})

export default connect(mapProps, actions)(App)
