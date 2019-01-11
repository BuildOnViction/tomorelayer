import { Route, BrowserRouter, HashRouter, Switch } from 'react-router-dom'
import { SITE_MAP } from '@constant'
import { Dashboard, Home } from '@route'
import { NavBar } from '@shared'
import { Container } from '@utility'
import '@static/favicon.ico'
import './style/app.scss'

const Router = process.env.STG === 'production' ? BrowserRouter : HashRouter

const App = () => (
  <Router>
    <div>
      <NavBar />
      <Container className="mt-5">
        <Switch>
          <Route exact path={SITE_MAP.root} component={Home} />
          <Route path={SITE_MAP.dashboard} component={Dashboard} />
        </Switch>
      </Container>
    </div>
  </Router>
)

export default App
