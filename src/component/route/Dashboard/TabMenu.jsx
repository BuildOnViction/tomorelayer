import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { AppBar, Tabs, Tab } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { $changeTab } from './actions'

const useStyles = withStyles(theme => ({
  appBar: {
    backgroundColor: 'white',
    color: 'inherit',
    boxShadow: 'none',
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


const TabMenu = useStyles(props => {
  const { activeTab, classes } = props
  return (
    <AppBar position="static" className={classes.appBar}>
      <Tabs value={activeTab} onChange={(e, val) => props.$changeTab(val)} className={classes.appMenu} classes={styles.menu}>
        <Tab label="Dashboard" disableRipple className={classes.appTab} />
        <Tab label="Insight" disableRipple className={classes.appTab} />
        <Tab label="Configurations" disableRipple className={classes.appTab} />
      </Tabs>
    </AppBar>
  )
})

const mapProps = state => ({
  activeTab: state.Dashboard.activeTab,
})

export default connect(mapProps, { $changeTab })(TabMenu)