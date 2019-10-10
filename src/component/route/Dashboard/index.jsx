import React from 'react'
import { connect } from 'redux-zero/react'
import { Box } from '@material-ui/core'
import * as _ from 'service/helper'
import TabMenu from './TabMenu'
import RelayerStat from './RelayerStat'
import RelayerConfig from './RelayerConfig'
import FeedBack from './FeedBack'
import { GetStats } from './actions'


class Dashboard extends React.Component {
  state = {
    tabValue: 0,
    showFeedback: false,
    tokenMap: {},
  }

  switchTab = (_, tabValue) => this.setState({
    tabValue,
    showFeedback: false,
  })

  switchFeedback = () => this.setState({ showFeedback: true })

  async componentDidMount() {
    await this.updateRelayerStat(this.props.match.params.coinbase)
  }

  async componentDidUpdate(prevProps) {
    const {
      match,
    } = this.props

    const {
      match: prevMatch,
    } = prevProps

    const coinbaseChanged = prevMatch.params.coinbase !== match.params.coinbase

    if (coinbaseChanged) {
      await this.updateRelayerStat(this.props.match.params.coinbase)
    }
  }

  async updateRelayerStat(coinbase) {
    const {
      AvailableTokens: Tokens,
      relayers,
    } = this.props

    const {
      tokenMap,
    } = this.state

    const relayer = relayers[coinbase]
    const uniqueTokens = _.unique(relayer.from_tokens.concat(relayer.to_tokens))

    const unrecognizedTokens = uniqueTokens.filter(addr => Object.keys(tokenMap).indexOf(addr) === -1)
    const tokenMetas = unrecognizedTokens.reduce((acc, t) => {
      const meta = Tokens.find(token => _.strEqual(token.address, t))
      return { ...acc, [t]: meta }
    }, {})

    const synchronousGetStat = tokens => () => {
      this.props.GetStats({ coinbase, tokens })
    }

    if (unrecognizedTokens.length > 0) {
      const updatedTokenMap = { ...tokenMap, ...tokenMetas }
      return this.setState({ tokenMap: updatedTokenMap }, synchronousGetStat(updatedTokenMap))
    }

    return synchronousGetStat(tokenMap)
  }

  render() {

    const {
      relayers,
      match,
    } = this.props

    const {
      tabValue,
      showFeedback,
    } = this.state

    const relayer = relayers[match.params.coinbase] || relayers[0]

    return (
      <Box style={{ transform: 'translateY(-30px)' }}>
        <TabMenu onChange={this.switchTab} value={tabValue} switchFeedback={this.switchFeedback} />
        <Box className="mt-2">
          {!showFeedback && tabValue === 0 && <RelayerStat relayer={relayer} />}
          {!showFeedback && tabValue === 1 && <RelayerConfig relayer={relayer} />}
          {this.state.showFeedback && <FeedBack />}
        </Box>
      </Box>
    )
  }
}

const mapProps = state => ({
  relayers: state.user.relayers,
  AvailableTokens: state.Tokens,
})

const actions = {
  GetStats,
}

export default connect(mapProps, actions)(Dashboard)
