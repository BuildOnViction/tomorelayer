import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { Link } from 'react-router-dom'
import { Button, Menu, MenuItem } from '@material-ui/core'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import { $changeRelayer } from './actions'

const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />)

const UserRelayerList = props => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const {
    activeRelayer,
    relayers,
  } = props

  if (relayers.length === 0 || !activeRelayer) {
    return (
      <div className="col-md-6">
        <Button size="small" component={AdapterLink} to="/register">
          Create your relayer
        </Button>
      </div>
    )
  }

  return (
    <div className="col-md-6">
      <Button size="small" component={AdapterLink} to="/dashboard">
        {activeRelayer.name}
      </Button>
      <Button aria-controls="relayer-menu" aria-haspopup="true" onClick={handleClick}>
        <KeyboardArrowDown />
      </Button>
      <Menu
        id="relayer-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {relayers.filter(r => r.id !== activeRelayer.id).map((r, idx) => (
          <MenuItem key={r.id} onClick={() => props.$changeRelayer(r)}>
            {r.name}
          </MenuItem>
        ))}
        <MenuItem>
          <Link to="/register">
            New!
          </Link>
        </MenuItem>
      </Menu>
    </div>
  )
}

const mapProps = state => ({
  relayers: state.User.relayers,
  activeRelayer: state.User.activeRelayer,
})

const actions = {
  $changeRelayer,
}

const storeConnect = connect(mapProps, actions)

export default storeConnect(UserRelayerList)
