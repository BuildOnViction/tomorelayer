import { Route, BrowserRouter, HashRouter, Switch } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import { SITE_MAP } from '@constant'
import { Dashboard, Home, Relayers, Registration } from '@route'
import { NavBar, RouteSwitch } from '@shared'
import { Container } from '@utility'
import { APP_INITIALIZER } from '@action'
import '@static/favicon.ico'
import '../style/app.scss'

const Router = process.env.STG === 'production' ? BrowserRouter : HashRouter

const mapProps = store => ({
  registeredRelayers: store.relayers,
  error: store.error,
  alert: store.alert,
})

class App extends React.Component {
  componentDidMount() {
    this.props.fetchRegisteredRelayers()
    this.props.fetchContracts()
    this.props.detectWeb3User()
  }

  render() {
    return (
      <Router>
        <div>
          <NavBar />
          <Container className="mt-5 pt-1">
            <RouteSwitch />
            <Switch>
              <Route exact path={SITE_MAP.Home} component={Home} />
              <Route path={SITE_MAP.Dashboard} component={Dashboard} />
              <Route path={SITE_MAP.Registration} component={Registration} />
              <Route path={SITE_MAP.Relayers} component={Relayers} />
            </Switch>
          </Container>
        </div>
      </Router>
    )
  }
}

export default connect(mapProps, APP_INITIALIZER)(App)
