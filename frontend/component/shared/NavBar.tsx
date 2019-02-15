import * as _ from 'rambda'
import { connect } from 'redux-zero/react'
import { withRouter, Link } from 'react-router-dom'
import { Alignment, Button, Navbar } from '@blueprintjs/core'
import logo from '@static/logo.png'

const { Group, Heading } = Navbar


const actions = () => ({
  toggleModal: state => ({
    loginModal: !state.loginModal
  })
})

const connector = _.compose(
  withRouter,
  connect(_.pick(['loginModal']), actions),
)

const WrappedNavBar = ({ loginModal, toggleModal }) => (
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
    <Group align={Alignment.RIGHT}>
      <Heading>
        <Button
          minimal
          large
          icon="log-in"
          className="round"
          onClick={props.toggleModal}
        />
      </Heading>
    </Group>
  </Navbar>
)

export const NavBar = connector(WrappedNavBar)
