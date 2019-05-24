import React from 'react'
import { connect } from 'redux-zero/react'
import { AppBar, Tabs, Tab } from '@material-ui/core'
import { $changeTab } from './actions'

const TabMenu = props => {
  const { activeTab } = props
  return (
    <AppBar position="static">
      <Tabs value={activeTab} onChange={(e, val) => props.$changeTab(val)}>
        <Tab label="Dashboard" disableRipple />
        <Tab label="Insight" disableRipple />
        <Tab label="Configurations" disableRipple />
      </Tabs>
    </AppBar>
  )
}

const mapProps = state => ({
  activeTab: state.Dashboard.activeTab,
})

export default connect(mapProps, { $changeTab })(TabMenu)
