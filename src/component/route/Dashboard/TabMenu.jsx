import React from 'react'
import { withRouter } from 'react-router-dom'
import {
  AppBar as MuiAppbar,
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

const TabMenu = ({
  onChange,
  value,
}) => {

  return (
    <AppBar position="static">
      <Tabs value={value} onChange={onChange} aria-label="relayer-dashboard-tabs">
        <Tab label="Relayer Page" />
        <Tab label="Configurations" />
        <Tab label="Feedback" style={{
          marginRight: 10,
          marginLeft: 'auto',
          minWidth: 'auto',
        }} />
      </Tabs>
    </AppBar>
  )
}

export default withRouter(TabMenu)
