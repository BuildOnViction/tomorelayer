import React from 'react'
import { withRouter } from 'react-router-dom'
import { AppBar, Tabs, Tab } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { AdapterLink } from 'component/shared/Adapters'

const useStyles = withStyles(theme => ({
  appBar: {
    backgroundColor: 'transparent',
    color: 'inherit',
    boxShadow: 'none',
    margin: '2em auto',
  },
  appMenu: {
    borderBottom: 'solid 1px #ddd',
  },
  appTab: {},
  appLabel: {
    float: 'right',
    position: 'absolute',
    right: 0,
    fontStyle: 'italic',
    opacity: '1 !important',
    fontWeight: 900,
    letterSpacing: 1,
  }
}))

const styles = {
  menu: {
    indicator: 'tab-menu--indicator'
  }
}

const mapRouteToValue = path => {
  if (path.includes('config')) return 1
  return 0
}

const TabMenu = useStyles(props => {
  const { classes, location } = props
  const path = location.pathname
  return (
    <AppBar position="static" className={classes.appBar}>
      <Tabs value={mapRouteToValue(path)} className={classes.appMenu} classes={styles.menu}>
        <Tab label="Dashboard" className={classes.appTab} component={AdapterLink} to={path.replace('/config', '')} />
        <Tab label="Configurations" className={classes.appTab} component={AdapterLink} to={`${path}/config`} />
      </Tabs>
    </AppBar>
  )
})

export default withRouter(TabMenu)
