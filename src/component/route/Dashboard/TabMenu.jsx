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
    '&>span': {
      width: 'auto',
    }
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
        <Tab label="Relayer Page" component={AdapterLink} to={path.replace('/config', '')} />
        <Tab label="Configurations" component={AdapterLink} to={`${path}/config`} />
      </Tabs>
    </AppBar>
  )
}

export default withRouter(TabMenu)
