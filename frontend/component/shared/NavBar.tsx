import { withRouter, Link } from 'react-router-dom'
import { Alignment, Button, Navbar } from '@blueprintjs/core'
import logo from '@static/logo.png'

const { Group, Heading } = Navbar


@withRouter
export class NavBar extends React.Component {
  render() {
    return (
      <Navbar className="bp3-light nav--container drop-shadow" fixedToTop>
        <Group align={Alignment.LEFT}>
          <Heading className="nav--heading">
            <img
              alt="logo"
              src={logo}
              className="nav--heading--logo ml-1"
            />
            <Link to="/" className="nav--heading--title text-dark ml-1">
              Tomochain Relayer Network
            </Link>
          </Heading>
        </Group>
      </Navbar>
    )
  }
}
