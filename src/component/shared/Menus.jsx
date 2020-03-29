import React from 'react'
import {
  Box,
  Button,
  ClickAwayListener,
  Menu,
  MenuItem,
} from '@material-ui/core'
import WalletIcon from '@material-ui/icons/AccountBalanceWallet'
import MenuIcon from '@material-ui/icons/Menu'
import { withStyles } from '@material-ui/core/styles'
import { AdapterLink } from 'component/shared/Adapters'
import { sequence } from 'service/helper'

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
      <InnerIcon style={{ marginRight: 5 }} />
      {props.text}
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
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display:'inline-block',
    width: 200,
    lineHeight: '45px',
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

const RouteMenuItem = React.forwardRef((props, ref) => (
  <StyledMenuItem onClick={props.onClick} component={AdapterLink} to={props.routeTo} innerRef={ref}>
    {props.text}
  </StyledMenuItem>
))


export const UserMenu = ({
  address,
}) => {

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
        text={address}
        icon={WalletIcon}

      />
      <ClickAwayListener onClickAway={handleClose}>
        <DropDownMenu
          id="relayer-list-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          style={{ transform: 'translateY(40px)' }}
        >
          <RouteMenuItem onClick={handleClose} routeTo="/profile" text="Profile" />
          <RouteMenuItem onClick={handleClose} routeTo="/logout" text="Logout" />
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

  const getRelayers = sequence(0, Object.keys(relayers).length / 2, idx => relayers[idx])

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
          {getRelayers.map(r => (
            <RouteMenuItem
              onClick={handleClose}
              routeTo={`/dashboard/${r.coinbase}`}
              key={r.coinbase}
              text={r.name || r.coinbase}
            />
          ))}
          <RouteMenuItem
            onClick={handleClose}
            routeTo="/register"
            text="Create relayer"
          />
        </DropDownMenu>
      </ClickAwayListener>
    </Box>
  )
}

export const StartRelayerButton = () => (
  <Button
    variant="contained"
    component={AdapterLink}
    to="/register"
  >
    Start a Relayer
  </Button>
)

export const ResponsiveMenu = ({ address, relayers, userOwnRelayer }) => {
  const [
    anchorEl,
    setAnchorEl,
  ] = React.useState(null)

  const handleClick = (event) => setAnchorEl(event.currentTarget)

  const handleClose = () => setAnchorEl(null)

  const getRelayers = sequence(0, Object.keys(relayers).length / 2, idx => relayers[idx])

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
          {userOwnRelayer && (
            <Box>
              <MenuTitle>My Relayers</MenuTitle>
              {getRelayers.map(r => (
                <RouteMenuItem
                  onClick={handleClose}
                  routeTo={`/dashboard/${r.coinbase}`}
                  key={r.coinbase}
                  text={r.name}
                />
              ))}
              <SpecialStyledMenuItem onClick={handleClose} routeTo="/register">
                Create new relayer
              </SpecialStyledMenuItem>
            </Box>
          )}
          {!userOwnRelayer && (
            <StyledMenuItem onClick={handleClose}>
              <StartRelayerButton onClick={handleClose} />
            </StyledMenuItem>
          )}
          <Box>
            <MenuTitle>Wallet: {address}</MenuTitle>
            <RouteMenuItem onClick={handleClose} routeTo="/profile" text="Profile" />
            <RouteMenuItem onClick={handleClose} routeTo="/logout" text="Logout" />
          </Box>
        </DropDownMenu>
      </ClickAwayListener>
    </Box>
  )
}
