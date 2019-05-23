import React from 'react'
import { Link } from 'react-router-dom'
import { Button, ClickAwayListener, Paper, Menu, MenuItem } from '@material-ui/core'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'

const LinkBtn = props => <Link to="/dashboard" {...props} />

const UserRelayerList = props => {
  return (
    <div className="col-md-6">
      <span>
        <Button component={LinkBtn} size="small">
          {props.relayers[props.activeRelayer].name}
        </Button>
      </span>
      <span>
        <Button onClick={props.openRelayerMenu}>
          <KeyboardArrowDown />
        </Button>
      </span>
      <ClickAwayListener onClickAway={props.handleClickAway}>
        <Paper>
          <Menu open={!!props.anchorEl} anchorEl={props.anchorEl}>
            {props.relayers.map((r, idx) => (
              <MenuItem onClick={() => props.changeActiveRelayer(idx)} key={r.id}>
                {r.name}
              </MenuItem>
            ))}
            <MenuItem onClick={props.createRelayer}>
              New Relayer
            </MenuItem>
          </Menu>
        </Paper>
      </ClickAwayListener>
    </div>
  )
}

export default UserRelayerList
