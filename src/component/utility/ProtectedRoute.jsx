import React from 'react'
import { Redirect, Route } from 'react-router-dom'

const Protected = ({
  path,
  component: Component,
  condition,
  redirect,
  ...rest
}) => {

  if (!condition) {
    return <Redirect to={redirect} />
  }

  return (
    <Route path={path} component={Component} {...rest} />
  )
}

export default Protected
