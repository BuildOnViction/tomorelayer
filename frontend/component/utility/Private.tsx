import { Redirect, Route } from 'react-router-dom'

const render = (Component, auth) => () => auth ? (
  <Component />
) : (
  <Redirect to="/" />
)

const Private = ({ path, component: Component, auth }) => (
  <Route
    path={path}
    render={render(Component, auth)}
  />
)

export default Private
