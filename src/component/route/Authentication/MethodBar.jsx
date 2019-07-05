import React from 'react'
import { AppBar, Box, Tabs, Tab } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

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
    marginBottom: 10,
  }
})(props => <AppBar {...props} />)

const StyledTabs = withStyles({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > div': {
      width: '100%',
      height: '100px',
      backgroundColor: '#272741',
      transform: 'translateY(-98px)',
      borderRadius: 5,
      zIndex: 0,
    },
  },
})(props => <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />)

const StyledTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    color: 'gray',
    fontWeight: theme.typography.fontWeightRegular,
    fontSize: 14,
    padding: 20,
    height: 100,
    minWidth: 100,
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
  <BoxWrap>
    <StyledAppBar position="static" color="default" elevation={0}>
      <StyledTabs
        value={value}
        onChange={(_, value) => onChange(value)}
        variant="fullWidth"
        scrollButtons="auto"
      >
        {options.map(op => <StyledTab label={op} key={op} />)}
      </StyledTabs>
    </StyledAppBar>
    {children}
  </BoxWrap>
)

export default MethodBar
