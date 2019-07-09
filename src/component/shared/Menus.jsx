import React from 'react'
import {
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core'
import { AdapterLink } from 'component/shared/Adapters'


export const UserMenu = () => {
  const [anchorEl, setAnchorEl] = React.useState(null)

  const handleClick = (event) => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  return (
    <div>
      <Button size="small" aria-controls="relayer-list-menu" aria-haspopup="true" onClick={handleClick}>
        User
      </Button>
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
      <Button size="small" aria-controls="relayer-list-menu" aria-haspopup="true" onClick={handleClick}>
        Your Relayers
      </Button>
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
