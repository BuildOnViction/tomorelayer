import { withRouter } from 'react-router-dom'
import {
  Alignment,
  Button,
  Navbar,
} from '@blueprintjs/core'


class NavBar extends React.Component {
  render() {
    return (
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>Tomochain Relayer Network</Navbar.Heading>
          <Navbar.Divider />
          <Button className="bp3-minimal" icon="home" text="Home" />
          <Button className="bp3-minimal" icon="document" text="Files" />
        </Navbar.Group>
      </Navbar>
    )
  }
}

export default withRouter(NavBar)
