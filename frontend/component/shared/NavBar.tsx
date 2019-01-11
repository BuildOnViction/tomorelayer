import { withRouter, Link } from 'react-router-dom'
import {
  Alignment,
  Button,
  Navbar,
} from '@blueprintjs/core'
import logo from '../../static/logo.png'


@withRouter
export class NavBar extends React.Component {
  render() {
    return (
      <Navbar className="bp3-dark nav--container" fixedToTop>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading className="nav--heading">
            <img alt="logo" src={logo} className="nav--heading--logo ml-1" />
            <Link to="/" className="nav--heading--title ml-1">
              Tomochain Relayer Network
            </Link>
          </Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <Button className="bp3-minimal" icon="home" text="Dashboard" large />
          <Button className="bp3-minimal" icon="user" large />
        </Navbar.Group>
      </Navbar>
    )
  }
}
