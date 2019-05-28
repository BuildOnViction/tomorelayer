import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from '@vutr/redux-zero/react'
import { Redirect, Route } from 'react-router-dom'

const Private = ({
  path,
  component: Component,
  activeRelayer,
  auth,
  history,
  ...rest
}) => {

  if (!activeRelayer && path === '/dashboard') {
    return <Redirect to="/" />
  }

  if (!auth && path !== '/login') {
    return <Redirect to="/login" />
  }

  return (
    <Route
      path={path}
      component={Component}
      {...rest}
    />
  )
}


const storeConnect = connect(state => ({
  auth: state.authStore.auth,
  activeRelayer: state.User.activeRelayer,
}))
export default withRouter(storeConnect(Private))
