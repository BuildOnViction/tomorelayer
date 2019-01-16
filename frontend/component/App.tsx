import { Route, BrowserRouter, HashRouter, Switch } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import { SITE_MAP } from '@constant'
import { Dashboard, Home, Relayers } from '@route'
import { NavBar, RouteSwitch } from '@shared'
import { Container } from '@utility'
import { AppInitializer } from '@action'
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
    this.props.detectWeb3User()
  }

  render() {
    return (
      <Router>
        <div>
          <NavBar />
          <Container className="mt-5 pt-1">
            <RouteSwitch />
            <Container className="p-3 drop-shadow switch-container mb-5">
              <Switch>
                <Route exact path={SITE_MAP.Home} component={Home} />
                <Route path={SITE_MAP.Dashboard} component={Dashboard} />
                <Route path={SITE_MAP.Relayers} component={Relayers} />
              </Switch>
            </Container>
          </Container>
        </div>
      </Router>
    )
  }
}

export default connect(mapProps, AppInitializer)(App)
