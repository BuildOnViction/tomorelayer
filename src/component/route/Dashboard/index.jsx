import React from 'react'
import { connect } from 'redux-zero/react'
import { Container, Grid } from 'component/utility'
import TabMenu from './TabMenu'
import RelayerHome from './RelayerHome'
import ConfigureBoard from './ConfigureBoard'
import { $changeTab } from './actions'

const Dashboard = props => {
  const { activeTab, activeRelayer } = props
  return (
    <Container>
      <TabMenu />
      <Grid className="mt-1 row col-12">
        {activeTab === 0 && <RelayerHome relayer={activeRelayer} />}
        {activeTab === 1 && <div>insight</div>}
        {activeTab === 2 && <ConfigureBoard relayer={activeRelayer} />}
      </Grid>
    </Container>
  )
}

const mapProps = state => ({
  activeRelayer: state.User.relayers[state.User.activeRelayer],
  activeTab: state.Dashboard.activeTab,
})

export default connect(mapProps, { $changeTab })(Dashboard)
