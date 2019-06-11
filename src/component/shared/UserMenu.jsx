import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from '@vutr/redux-zero/react'
import { Button, ClickAwayListener, Paper, Menu, MenuItem } from '@material-ui/core'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import { $logout } from './actions'


const UserMenu = props => {
  const {
    auth,
    openMenu,
    handleClickAway,
    anchorEl,
  } = props

  if (!auth) {
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
      <Button onClick={openMenu} size="small">
        MyWallet&nbsp;
        <KeyboardArrowDown />
      </Button>
      <ClickAwayListener onClickAway={handleClickAway('user-menu')}>
        <Paper>
          <Menu open={!!anchorEl} anchorEl={anchorEl}>
            <MenuItem>Profile</MenuItem>
            <MenuItem>My account</MenuItem>
            <MenuItem onClick={props.$logout}>Logout</MenuItem>
          </Menu>
        </Paper>
      </ClickAwayListener>
    </div>
  )
}

const mapProps = state => ({
  auth: state.authStore.auth
})

export default connect(mapProps, { $logout })(UserMenu)
