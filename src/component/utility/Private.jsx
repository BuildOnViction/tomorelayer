import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from '@vutr/redux-zero/react'
import { Redirect, Route } from 'react-router-dom'

const Private = ({
  path,
  component: Component,
  auth,
  history,
  ...rest
}) => {

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


const storeConnect = connect(store => ({ auth: store.authStore.auth }))
export default withRouter(storeConnect(Private))
