import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { Container, Grid } from 'component/utility'
import TabMenu from './TabMenu'
import RelayerHome from './RelayerHome'
import ConfigBoard from './ConfigBoard'

class Dashboard extends React.Component {
  state = {
    tab: 0
  }

  componentDidUpdate(prevProps) {
    if (this.props.relayerId !== prevProps.relayerId) {
      this.setState({ tab: 0 })
    }
  }

  changeTab = tab => this.setState({ tab })

  render() {
    const { tab } = this.state
    return (
      <Container>
        <TabMenu changeTab={this.changeTab} activeTab={tab} />
        <Grid className="mt-1 row col-12">
          {tab === 0 && <RelayerHome />}
          {tab === 1 && <div>insight</div>}
          {tab === 2 && <ConfigBoard />}
        </Grid>
      </Container>
    )
  }
}

const mapProps = state => ({
  relayerId: state.User.activeRelayer.id
})

const storeConnect = connect(mapProps)

export default storeConnect(Dashboard)
