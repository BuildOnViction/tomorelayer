import React from 'react'
import { withRouter } from 'react-router-dom'
import {
  AppBar as MuiAppbar,
  Tabs as MuiTabs,
  Tab as MuiTab,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { AdapterLink } from 'component/shared/Adapters'

const AppBar = withStyles(theme => ({
  root: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderBottom: `solid 1px ${theme.palette.subtitle}33`,
  }
}))(MuiAppbar)

const Tabs = withStyles(theme => ({
  root: {
  }
}))(MuiTabs)

const Tab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    flexDirection: 'initial',
    marginRight: 10,
    padding: 0,
    width: 100,
  }
}))(MuiTab)

const mapRouteToValue = path => {
  if (path.includes('config')) {return 1}
  return 0
}

const TabMenu = ({
  location,
}) => {

  const path = location.pathname

  return (
    <AppBar position="static">
      <Tabs value={mapRouteToValue(path)}>
        <Tab label="Dashboard" component={AdapterLink} to={path.replace('/config', '')} />
        <Tab label="Configurations" component={AdapterLink} to={`${path}/config`} />
      </Tabs>
    </AppBar>
  )
}

export default withRouter(TabMenu)
