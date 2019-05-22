import React from 'react'
import { Button, Menu, MenuItem } from '@material-ui/core'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'


const UserMenu = props => {
  return (
    <div className="col-md-6">
      <Button onClick={props.openMenu}>
        MyWallet&nbsp;
        <KeyboardArrowDown />
      </Button>
      <Menu id="simple-menu" open={!!props.anchorEl} anchorEl={props.anchorEl}>
        <MenuItem onClick={props.menuItemClick('profile')}>Profile</MenuItem>
        <MenuItem onClick={props.menuItemClick('account')}>My account</MenuItem>
        <MenuItem onClick={props.menuItemClick('logout')}>Logout</MenuItem>
        <MenuItem onClick={props.menuItemClick('cancel')} className="menu-item--cancel">
          Cancel
        </MenuItem>
      </Menu>
    </div>
  )
}

export default UserMenu
