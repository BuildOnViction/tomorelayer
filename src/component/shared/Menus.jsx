import React from 'react'
import {
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'
import MenuIcon from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/core/styles'
import { AdapterLink } from 'component/shared/Adapters'

const MenuButton = withStyles(theme => ({
  root: {
    color: '#CFCDE1',
    textTransform: 'none',
    margin: '0 1rem',
  },
}))(Button)

export const UserMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  return (
    <div>
      <MenuButton
        aria-label="User"
        aria-controls="relayer-list-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
      >
        User<PersonIcon style={{ marginLeft: 5 }} />
      </MenuButton>
      <Menu
        id="relayer-list-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{ transform: 'translateY(30px)' }}
      >
        <MenuItem component={AdapterLink} to="/profile">
          Profile
        </MenuItem>
        <MenuItem component={AdapterLink} to="/logout">
          Logout
        </MenuItem>
      </Menu>
    </div>
  )
}

export const RelayerMenu = ({ relayers }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  return (
    <div>
      <MenuButton aria-controls="relayer-list-menu" aria-haspopup="true" onClick={handleClick} size="small">
        My Relayers <MenuIcon style={{ marginLeft: 5 }} />
      </MenuButton>
      <Menu
        id="relayer-list-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{ transform: 'translateY(30px)' }}
      >
        {Object.values(relayers).sort((a,b) => a.name.localeCompare(b.name)).map(r => (
          <MenuItem component={AdapterLink} to={`/dashboard/${r.coinbase}`} key={r.coinbase}>
            {r.name}
          </MenuItem>
        ))}
        <MenuItem component={AdapterLink} to="/register">
          Create new relayer
        </MenuItem>
      </Menu>
    </div>
  )
}
