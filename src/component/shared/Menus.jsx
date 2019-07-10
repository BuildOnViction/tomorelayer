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

const DropDownMenu = withStyles(theme => ({
  paper: {
    width: 170,
  }
}))(Menu)

const StyledMenuItem = withStyles(theme => ({
  root: {
    borderRadius: 0,
    margin: 0,
    color: '#7473A6',
  }
}))(MenuItem)

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
      <DropDownMenu
        id="relayer-list-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{ transform: 'translateY(40px)' }}
      >
        <StyledMenuItem component={AdapterLink} to="/profile">
          Profile
        </StyledMenuItem>
        <StyledMenuItem component={AdapterLink} to="/logout">
          Logout
        </StyledMenuItem>
      </DropDownMenu>
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
      <DropDownMenu
        id="relayer-list-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{ transform: 'translateY(40px)' }}
      >
        {Object.values(relayers).sort((a,b) => a.name.localeCompare(b.name)).map(r => (
          <StyledMenuItem component={AdapterLink} to={`/dashboard/${r.coinbase}`} key={r.coinbase}>
            {r.name}
          </StyledMenuItem>
        ))}
        <StyledMenuItem component={AdapterLink} to="/register">
          Create new relayer
        </StyledMenuItem>
      </DropDownMenu>
    </div>
  )
}
