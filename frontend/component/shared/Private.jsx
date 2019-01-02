import React from 'react'
import { Redirect, Route } from 'react-router-dom'

const Private = ({ path, component: Component, auth }) => (
  <Route
    path={path}
    render={() => auth ? <Component /> : <Redirect to="/" />}
  />
)

export default Private
