import { withRouter } from 'react-router-dom'
import {
  Alignment,
  Button,
  Navbar,
} from '@blueprintjs/core'


@withRouter
export class NavBar extends React.Component {
  render() {
    return (
      <Navbar className="bp3-dark" fixedToTop>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading className="nav--heading">
            Tomochain Relayer Network
          </Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          <Button className="bp3-minimal" icon="home" text="Relayer Dashboard" large />
          <Button className="bp3-minimal" icon="user" large />
        </Navbar.Group>
      </Navbar>
    )
  }
}
