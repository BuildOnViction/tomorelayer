import { withRouter } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import { Redirect, Route } from 'react-router-dom'

const Private = ({
  path,
  component: Component,
  auth,
  history,
  ...rest
}) => {

  if (auth && path === '/login') {
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


const storeConnect = connect(store => ({ auth: store.auth }))
const injectHistory = withRouter(Private)
export default storeConnect(injectHistory)
