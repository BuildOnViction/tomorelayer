import React from 'react'
import { connect } from 'redux-zero/react'
import { Box } from '@material-ui/core'
import TabMenu from './TabMenu'
import RelayerStat from './RelayerStat'
import RelayerConfig from './RelayerConfig'
// import FeedBack from './FeedBack'

class Dashboard extends React.Component {
  state = {
    tabValue: 0,
  }

  switchTab = (_, tabValue) => this.setState({ tabValue })

  async componentDidMount() {
    await this.updateRelayerStat(this.props.match.params.coinbase)
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.match.params.coinbase !== this.props.match.params.coinbase) {
      await this.updateRelayerStat(this.props.match.params.coinbase)
    }
  }

  async updateRelayerStat(coinbase) {
    console.log('request coinbase stat', coinbase)
  }

  render() {

    const {
      relayers,
      match,
    } = this.props

    const relayer = relayers[match.params.coinbase] || relayers[0]

    return (
      <Box style={{ transform: 'translateY(-30px)' }}>
        <TabMenu onChange={this.switchTab} value={this.state.tabValue} />
        <Box className="mt-2">
          {this.state.tabValue === 0 && <RelayerStat relayer={relayer} />}
          {this.state.tabValue === 1 && <RelayerConfig relayer={relayer} />}
        </Box>
      </Box>
    )
  }
}

const mapProps = state => ({
  relayers: state.user.relayers
})

export default connect(mapProps)(Dashboard)
