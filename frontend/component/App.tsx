import { Route, BrowserRouter, HashRouter, Switch } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import { SITE_MAP } from '@constant'
import { Dashboard, Home } from '@route'
import { NavBar } from '@shared'
import { Container } from '@utility'
import { AppInitializer } from '@action'
import '@static/favicon.ico'
import '../style/app.scss'

const Router = process.env.STG === 'production' ? BrowserRouter : HashRouter

const mapProps = store => ({
  registeredRelayers: store.relayers,
  error: store.error,
})

class App extends React.Component {
  componentDidMount() {
    /* NOTE: some action on app intilization..
     * 1/ Fetch relayer list from Backend
     * 2/ Fetch current user's address
     * 3/ Compare is this current user is a relayer, show some notification/welcome message
     * 4/ Get relayer's contract for comparing too...
     */
    this.props.fetchRegisteredRelayers()
    this.props.detectWeb3User()
  }

  render() {
    return (
      <Router>
        <div>
          <NavBar />
          <Container full className="mt-5 pt-1">
            <Switch>
              <Route exact path={SITE_MAP.root} component={Home} />
              <Route path={SITE_MAP.dashboard} component={Dashboard} />
            </Switch>
          </Container>
        </div>
      </Router>
    )
  }
}

export default connect(mapProps, AppInitializer)(App)
