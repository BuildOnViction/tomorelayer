import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from '@vutr/redux-zero/react'
import { Button, Menu, MenuItem } from '@material-ui/core'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import { AdapterLink } from 'component/shared/Adapters'
import { $changeRelayer } from './actions'


const UserRelayerList = props => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const {
    activeRelayer,
    relayers,
    history,
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

  const handleMenuItemClick = relayer => () => {
    setAnchorEl(null)
    setTimeout(() => props.$changeRelayer(relayer), 300)
  }

  const createNewRelayer = () => {
    setAnchorEl(null)
    setTimeout(() => history.push('/register'), 100)
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
          <MenuItem key={r.id} onClick={handleMenuItemClick(r)}>
            {r.name}
          </MenuItem>
        ))}
        <MenuItem onClick={createNewRelayer}>
          New Relayer
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

export default storeConnect(withRouter(UserRelayerList))
