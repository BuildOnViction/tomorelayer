import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import styled from 'styled-components'

import MainNavigator from './component/MainNavigator'
import Private from './component/util/Private'
import SampleComponent from './component/SampleComponent'
import Welcome from './component/Welcome'

import './style/app.scss'

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

const Divider = styled.hr`
  border-top: solid 1px #ddd;
  margin: 2em 0;
`

const Main = () => (
  <MainNavigator>
    <InnerContent>
      <h1>Relayer-MS</h1>
      <Divider />
      <SampleComponent text={text} />
    </InnerContent>
  </MainNavigator>
)

const App = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Private path="/home" component={Main} auth />
    </Switch>
  </Router>
)

export default App
