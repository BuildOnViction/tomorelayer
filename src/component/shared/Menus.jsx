import React from 'react'
import {
  Box,
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
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
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
    [theme.breakpoints.down('sm')]: {
      minWidth: 300,
    },
  }
}))(Menu)

const MenuTitle = withStyles(theme => ({
  root: {
    borderRadius: 0,
    margin: 0,
    color: theme.palette.maintitle,
    cursor: 'unset',
    '&:hover': {
      cursor: 'unset',
      backgroundColor: 'unset',
    },
  }
}))(MenuItem)

const StyledMenuItem = withStyles(theme => ({
  root: {
    borderRadius: 0,
    margin: 0,
    color: theme.palette.subtitle,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 28,
    },
  }
}))(MenuItem)

const SpecialStyledMenuItem = withStyles(theme => ({
  root: {
    borderRadius: 0,
    margin: 0,
    background: theme.palette.tabInactive,
    color: theme.palette.link,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 25,
    },
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
    <Box>
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
          <StyledMenuItem onClick={handleClose} component={AdapterLink} to="/profile">
            Profile
          </StyledMenuItem>
          <StyledMenuItem onClick={handleClose} component={AdapterLink} to="/logout">
            Logout
          </StyledMenuItem>
        </DropDownMenu>
      </ClickAwayListener>
    </Box>
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
    <Box>
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
            <StyledMenuItem onClick={handleClose} component={AdapterLink} to={`/dashboard/${r.coinbase}`} key={r.coinbase}>
              {r.name}
            </StyledMenuItem>
          ))}
          <SpecialStyledMenuItem onClick={handleClose} component={AdapterLink} to="/register">
            Create new relayer
          </SpecialStyledMenuItem>
        </DropDownMenu>
      </ClickAwayListener>
    </Box>
  )
}

export const StartRelayerButton = () => <Button variant="contained" component={AdapterLink} to="/register">Start a Relayer</Button>

export const ResponsiveMenu = React.forwardRef((props, ref) => {
  const [
    anchorEl,
    setAnchorEl,
  ] = React.useState(null)

  const handleClick = (event) => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  return (
    <Box>
      <MenuButton
        aria-controls="reponsive-list-menu"
        aria-haspopup="true"
        onClick={handleClick}
        text=""
        icon={MenuIcon}
      />
      <ClickAwayListener onClickAway={handleClose}>
        <DropDownMenu
          id="reponsive-list-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          style={{ transform: 'translateY(40px)' }}
        >
          <MenuTitle ref={ref}>
            {props.children}
          </MenuTitle >
          {props.userOwnRelayer && (
            <Box>
              <MenuTitle>My Relayers</MenuTitle>
              {Object.values(props.relayers).sort((a,b) => a.name.localeCompare(b.name)).map(r => (
                <StyledMenuItem onClick={handleClose} component={AdapterLink} to={`/dashboard/${r.coinbase}`} key={r.coinbase}>
                  {r.name}
                </StyledMenuItem>
              ))}
              <SpecialStyledMenuItem onClick={handleClose} component={AdapterLink} to="/register">
                Create new relayer
              </SpecialStyledMenuItem>
            </Box>
          )}
          {!props.userOwnRelayer && <StyledMenuItem onClick={handleClose}><StartRelayerButton onClick={handleClose} /></StyledMenuItem>}
          <Box>
            <MenuTitle>User</MenuTitle>
            <StyledMenuItem onClick={handleClose} component={AdapterLink} to="/profile">
              Profile
            </StyledMenuItem>
            <StyledMenuItem onClick={handleClose} component={AdapterLink} to="/logout">
              Logout
            </StyledMenuItem>
          </Box>
        </DropDownMenu>
      </ClickAwayListener>
    </Box>
  )
})
