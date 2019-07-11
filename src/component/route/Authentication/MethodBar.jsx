import React from 'react'
import { AppBar, Box, Tabs, Tab } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import ledgerwallet_icon from 'asset/logo-ledgerwallet.png'
import metamask_icon from 'asset/logo-metamask.png'
import mnemonic_icon from 'asset/logo-mnemonic.png'
import privatekey_icon from 'asset/logo-privatekey.png'
import tomowallet_icon from 'asset/logo-tomowallet.png'
import trezorwallet_icon from 'asset/logo-trezorwallet.png'


const MethodIcons = {
  'Tomo Wallet': tomowallet_icon,
  'Ledger Wallet': ledgerwallet_icon,
  'MetaMask': metamask_icon,
  'Mnemonic': mnemonic_icon,
  'Private Key': privatekey_icon,
  'Trezor Wallet': trezorwallet_icon,
}

const BoxWrap = withStyles({
  root: {
    margin: '50px auto',
    overflow: 'scroll',
  }
})(props => <Box {...props} />)

const StyledAppBar = withStyles({
  root: {
    backgroundColor: 'transparent',
    border: 'transparent',
    borderRadius: 8,
  }
})(props => <AppBar {...props} />)

const StyledTabs = withStyles({
  indicator: {
    height: '100%',
    backgroundColor: '#272741',
    borderRadius: 10,
    zIndex: 0,
  },
})(props => <Tabs {...props} />)

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    color: '#7473A6',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: 14,
    padding: 20,
    minHeight: 170,
    zIndex: 1,
  },
  selected: {
    color: 'white',
  },
}))(props => <Tab disableRipple {...props} />)

const MethodBar = ({
  value,
  onChange,
  options,
  children,
}) => (
  <BoxWrap className="mb-3">
    <StyledAppBar position="static" color="default" elevation={0}>
      <StyledTabs
        value={value}
        onChange={(_, value) => onChange(value)}
        variant="fullWidth"
        scrollButtons="auto"
      >
        {options.map(op => (
          <StyledTab
            className="icon-logo"
            icon={<img alt="logo" src={MethodIcons[op]}/>}
            label={(
              <span className="mt-1">
                {op}
              </span>
            )}
            key={op}
          />
        ))}
      </StyledTabs>
    </StyledAppBar>
    {children}
  </BoxWrap>
)

export default MethodBar
