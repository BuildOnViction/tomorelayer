import React from 'react'
import { Redirect, Route } from 'react-router-dom'

interface IPrivateRoute {
  path: string
  component: React.FunctionComponent
  auth: boolean
}

const Private: React.FunctionComponent<IPrivateRoute> = ({ path, component: Component, auth }) => (
  <Route
    path={path}
    render={() => auth ? <Component /> : <Redirect to="/" />}
  />
)

export default Private
