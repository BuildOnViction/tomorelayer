import React from 'react'
import {
  Button,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@material-ui/core'
import { AdapterLink } from 'component/shared/Adapters'


export const UserMenu = props => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)

  const handleToggle = () => setOpen(prevOpen => !prevOpen)

  const handleClose = (event) => {
    const alreadyOpen = anchorRef.current && anchorRef.current.contains(event.target)
    if (alreadyOpen) return undefined
    return setOpen(false)
  }

  return (
    <div>
      <Button
        size="small"
        ref={anchorRef}
        aria-controls="menu-list-grow"
        aria-haspopup="true"
        onClick={handleToggle}
      >
        USER PROFILE
      </Button>
      <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper id="menu-list-grow">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  <MenuItem component={AdapterLink} to="/logout">
                    Logout
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}

export const RelayerMenu = ({ relayers }) => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)

  const handleToggle = () => setOpen(prevOpen => !prevOpen)

  const handleClose = (event) => {
    const alreadyOpen = anchorRef.current && anchorRef.current.contains(event.target)
    if (alreadyOpen) return undefined
    return setOpen(false)
  }

  return (
    <div>
      <Button
        size="small"
        ref={anchorRef}
        aria-controls="menu-list-grow"
        aria-haspopup="true"
        onClick={handleToggle}
      >
        YOUR RELAYERS
      </Button>
      <Popper open={open} anchorEl={anchorRef.current} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
          >
            <Paper id="menu-list-grow">
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList>
                  {Object.values(relayers).sort((a,b) => a.name.localeCompare(b.name)).map(r => (
                    <MenuItem component={AdapterLink} to={`/dashboard/${r.coinbase}`} key={r.coinbase}>
                      {r.name}
                    </MenuItem>
                  ))}
                  <MenuItem component={AdapterLink} to="/register">
                    Create new relayer
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  )
}
