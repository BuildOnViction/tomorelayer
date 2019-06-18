import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from '@vutr/redux-zero/react'
import { Button, Menu, MenuItem } from '@material-ui/core'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import { AdapterLink } from 'component/shared/Adapters'
import { $logout } from './actions'


const UserMenu = props => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = event => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const menuItemClick = func => () => {
    setAnchorEl(null)
    return func()
  }

  const { auth } = props

  if (!auth) {
    return (
      <div className="col-md-6">
        <Button size="small" component={AdapterLink} to="/login">
          LOGIN
        </Button>
      </div>
    )
  }

  return (
    <div className="col-md-6">
      <Button onClick={handleClick} size="small" aria-controls="user-menu" aria-haspopup="true">
        MyWallet&nbsp;
        <KeyboardArrowDown />
      </Button>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={menuItemClick(props.$logout)}>
          Logout
        </MenuItem>
      </Menu>
    </div>
  )
}

const mapProps = state => ({
  auth: state.authStore.auth
})

const actions = {
  $logout
}

const storeConnect = connect(mapProps, actions)

export default storeConnect(withRouter(UserMenu))
