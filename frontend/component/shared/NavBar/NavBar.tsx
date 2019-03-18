import { connect } from 'redux-zero/react'
import { Divider } from '@utility'
import Header from './Header'
import RouteSelect from './RouteSelect'
import './navbar.scss'

const decorator = connect(
  null,
  () => ({
    logout: () => ({ auth: false })
  })
)

export const NavBar = decorator(({ logout }) => (
  <div className="nav col-lg-2 col-md-3 col-sm-3 col-xs-2 align-self-stretch pt-3">
    <Header />
    <RouteSelect />
    <Divider className="m-2" />
    <a onClick={logout} className="btn btn-warning">
      Logout
    </a>
  </div>
))
