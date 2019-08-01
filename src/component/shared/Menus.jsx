import React from 'react'
import {
  Button,
  ClickAwayListener,
  Menu,
  MenuItem,
} from '@material-ui/core'
import PersonIcon from '@material-ui/icons/Person'
import MenuIcon from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/core/styles'
import { AdapterLink } from 'component/shared/Adapters'

const MenuButton = withStyles(theme => ({
  root: {
    textTransform: 'none',
    margin: `0px ${theme.spacing(2)}px`,
    color: theme.palette.maintitle,
  }
}))(props => {
  const InnerIcon = props.icon
  return (
    <Button {...props} size="small">
      {props.text} <InnerIcon style={{ marginLeft: 5 }} />
    </Button>
  )
})

const DropDownMenu = withStyles(theme => ({
  paper: {
    width: 'auto',
    minWidth: 150,
    maxWidth: 200,
  }
}))(Menu)

const StyledMenuItem = withStyles(theme => ({
  root: {
    borderRadius: 0,
    margin: 0,
    color: theme.palette.subtitle,
  }
}))(MenuItem)

const SpecialStyledMenuItem = withStyles(theme => ({
  root: {
    borderRadius: 0,
    margin: 0,
    background: theme.palette.tabInactive,
    color: theme.palette.link,
  }
}))(MenuItem)


export const UserMenu = () => {

  const [
    anchorEl,
    setAnchorEl,
  ] = React.useState(null)

  const handleClick = (event) => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  return (
    <div>
      <MenuButton
        aria-label="User"
        aria-controls="relayer-list-menu"
        aria-haspopup="true"
        onClick={handleClick}
        text="User"
        icon={PersonIcon}
      />
      <ClickAwayListener onClickAway={handleClose}>
        <DropDownMenu
          id="relayer-list-menu"
          anchorEl={anchorEl}
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
      </ClickAwayListener>
    </div>
  )
}

export const RelayerMenu = ({ relayers }) => {
  const [
    anchorEl,
    setAnchorEl,
  ] = React.useState(null)

  const handleClick = (event) => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  return (
    <div>
      <MenuButton
        aria-controls="relayer-list-menu"
        aria-haspopup="true"
        onClick={handleClick}
        text="My Relayers"
        icon={MenuIcon}
      />
      <ClickAwayListener onClickAway={handleClose}>
        <DropDownMenu
          id="relayer-list-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          style={{ transform: 'translateY(40px)' }}
        >
          {Object.values(relayers).sort((a,b) => a.name.localeCompare(b.name)).map(r => (
            <StyledMenuItem component={AdapterLink} to={`/dashboard/${r.coinbase}`} key={r.coinbase}>
              {r.name}
            </StyledMenuItem>
          ))}
          <SpecialStyledMenuItem component={AdapterLink} to="/register">
            Create new relayer
          </SpecialStyledMenuItem>
        </DropDownMenu>
      </ClickAwayListener>
    </div>
  )
}
