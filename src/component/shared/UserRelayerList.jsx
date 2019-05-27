import React from 'react'
import { connect } from 'redux-zero/react'
import { Link } from 'react-router-dom'
import { Button, ClickAwayListener, Paper, Menu, MenuItem } from '@material-ui/core'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import { $changeRelayer } from './actions'


const LinkBtn = props => <Link to="/register" {...props} />
const DashboardBtn = props => <Link to="/dashboard" {...props} />

const UserRelayerList = props => {
  const {
    activeRelayer,
    relayers,
    anchorEl,
    handleClickAway,
    openRelayerMenu,
  } = props

  if (relayers.length === 0) {
    return (
      <div className="col-md-6">
        <Button component={LinkBtn} size="small">
          Create your relayer
        </Button>
      </div>
    )
  }

  return (
    <div className="col-md-6">
      <Button size="small" component={DashboardBtn}>
        {relayers[activeRelayer].name}
      </Button>
      <Button onClick={openRelayerMenu}>
        <KeyboardArrowDown />
      </Button>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper>
          <Menu open={!!anchorEl} anchorEl={anchorEl}>
            {relayers.map((r, idx) => (
              <MenuItem key={r.id} onClick={() => props.$changeRelayer(idx)}>
                {r.name}
              </MenuItem>
            ))}
            <MenuItem>
              <Link to="/register">
                New!
              </Link>
            </MenuItem>
          </Menu>
        </Paper>
      </ClickAwayListener>
    </div>
  )
}

const mapProps = state => ({
  relayers: state.User.relayers,
  activeRelayer: state.User.activeRelayer,
})

export default connect(mapProps, { $changeRelayer })(UserRelayerList)
