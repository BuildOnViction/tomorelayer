import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from '@vutr/redux-zero/react'
import { Button, Menu, MenuItem } from '@material-ui/core'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import { $logout } from './actions'


const UserMenu = props => {
  if (!props.auth) {
    return (
      <div className="col-md-6">
        <Button size="small" component={props => <Link to="/login" {...props} />}>
          LOGIN
        </Button>
      </div>
    )
  }

  return (
    <div className="col-md-6">
      <Button onClick={props.openMenu} size="small">
        MyWallet&nbsp;
        <KeyboardArrowDown />
      </Button>
      <Menu id="simple-menu" open={!!props.anchorEl} anchorEl={props.anchorEl}>
        <MenuItem onClick={props.menuItemClick('profile')}>Profile</MenuItem>
        <MenuItem onClick={props.menuItemClick('account')}>My account</MenuItem>
        <MenuItem onClick={props.$logout}>Logout</MenuItem>
      </Menu>
    </div>
  )
}

const mapProps = state => ({
  auth: state.authStore.auth
})

const actions = store => ({
  $logout: state => $logout(state, store)
})

export default connect(mapProps, actions)(UserMenu)
