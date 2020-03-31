import React from 'react'
import { withRouter } from 'react-router-dom'
import {
  AppBar as MuiAppbar,
  Button,
  Tabs as MuiTabs,
  Tab as MuiTab,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const AppBar = withStyles(theme => ({
  root: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderBottom: `solid 1px ${theme.palette.subtitle}33`,
  }
}))(MuiAppbar)

const Tabs = withStyles(theme => ({
  indicator: {
    backgroundColor: theme.palette.buttonActive,
    width: '60px !important',
    height: 4,
    borderRadius: 5,
  }
}))(MuiTabs)

const Tab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    padding: 0,
    fontSize: 16,
    justifyContent: 'flex-start',
    marginRight: 20,
    '&>span': {
      width: 'auto',
    }
  }
}))(MuiTab)

const FloatButton = withStyles(theme => ({
  root: {
    color: theme.palette.maintitle,
    position: 'absolute',
    right: 0,
    padding: 0,
    top: 15,
    textTransform: 'none',
    fontWeight: 500,
    fontSize: 16,
    '&:hover': {
      color: theme.palette.subtitle,
    }
  }
}))(Button)

const TabMenu = ({
  onChange,
  value,
  switchFeedback,
}) => {

  return (
    <AppBar position="static">
      <Tabs value={value} onChange={onChange} aria-label="relayer-dashboard-tabs">
        <Tab label="Relayer Page" />
        <Tab label="Configurations" />
      </Tabs>
      <FloatButton onClick={switchFeedback}>Feedback</FloatButton>
    </AppBar>
  )
}

export default withRouter(TabMenu)
