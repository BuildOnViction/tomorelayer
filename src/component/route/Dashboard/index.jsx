import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { Container, Grid } from 'component/utility'
import TabMenu from './TabMenu'
import RelayerHome from './RelayerHome'
import ConfigureBoard from './ConfigureBoard'


class Dashboard extends React.Component {
  state = {
    activeTab: 0,
  }

  changeTab = activeTab => this.setState({ activeTab })

  render() {
    const { activeTab } = this.state
    const { activeRelayer } = this.props

    return (
      <Container>
        <TabMenu changeTab={this.changeTab} activeTab={activeTab} />
        <Grid className="mt-1 row col-12">
          {activeTab === 0 && <RelayerHome relayer={activeRelayer} />}
          {activeTab === 1 && <div>insight</div>}
          {activeTab === 2 && <ConfigureBoard relayer={activeRelayer} />}
        </Grid>
      </Container>
    )
  }
}

const mapProps = state => ({
  activeRelayer: state.User.activeRelayer,
})

export default connect(mapProps)(Dashboard)
