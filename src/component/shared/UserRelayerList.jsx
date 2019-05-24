import React from 'react'
import { connect } from 'redux-zero/react'
import { Link } from 'react-router-dom'
import { Button, ClickAwayListener, Paper, Menu, MenuItem } from '@material-ui/core'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown'
import { SITE_MAP } from 'service/constant'
import { $changeActiveRelayer } from './actions'


const LinkBtn = props => <Link to="/register" {...props} />

const UserRelayerList = props => {
  const {
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
      <Button size="small" onClick={openRelayerMenu}>
        <span>{relayers.length} Active Relayers</span>&nbsp;<KeyboardArrowDown />
      </Button>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Paper>
          <Menu open={!!anchorEl} anchorEl={anchorEl}>
            {relayers.map((r, idx) => (
              <MenuItem key={r.id}>
                <Link to={`${SITE_MAP.Dashboard}/${idx}`}>
                  {r.name}
                </Link>
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

export default connect(mapProps, { $changeActiveRelayer })(UserRelayerList)
