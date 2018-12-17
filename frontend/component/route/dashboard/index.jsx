import { Route, Switch, Link } from 'react-router-dom'
import styled from 'styled-components'
import Loadable from 'react-loadable'
import Spinner from '@atlaskit/spinner'
import MainNavigator from './MainNavigator'
import { Divider } from '../../shared'

const text = `Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Nunc rutrum nisl ut ante dignissim, at tempor elit pellentesque.
Donec cursus semper arcu semper vestibulum.
Morbi et nibh quis nulla mollis vehicula nec luctus nulla. In eleifend rhoncus sagittis.
Donec non odio vel neque laoreet aliquet vel quis dui. Duis id metus nisl.
Aliquam a est in neque maximus maximus.
Maecenas fringilla nibh porta libero eleifend, quis tempus leo auctor.
Vestibulum non felis vel nibh laoreet semper vel eu nisi.
`

const InnerContent = styled.div`
  padding: 2em;
  > h1 {
  color: red;
  }
`

const SampleComponent = Loadable({
  loader: () => import('./SampleComponent'),
  loading: Spinner,
  render(Component) {
    return <Component.default text={text} />
  },
})

const AnotherComponent = Loadable({
  loader: () => import('./AnotherComponent'),
  loading: Spinner,
})

const Dashboard = () => (
  <MainNavigator>
    <InnerContent>
      <h1>Relayer-MS</h1>
      <div>
        <Link to="/dashboard/lazy">To Lazy component...</Link>
        <Link to="/dashboard">Go Dashboard...</Link>
        <Link to="/">Go Home</Link>
      </div>
      <Divider />
      <Switch>
        <Route exact path="/dashboard" component={SampleComponent} />
        <Route path="/dashboard/lazy" component={AnotherComponent} />
      </Switch>
    </InnerContent>
  </MainNavigator>
)

export default Dashboard
