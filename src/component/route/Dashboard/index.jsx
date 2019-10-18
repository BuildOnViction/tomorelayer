import React from 'react'
import { connect } from 'redux-zero/react'
import { Box } from '@material-ui/core'
import * as _ from 'service/helper'
import { ERC20TokenInfo as getTokenInfo } from 'service/blockchain'
import TabMenu from './TabMenu'
import RelayerStat from './RelayerStat'
import RelayerConfig from './RelayerConfig'
import FeedBack from './FeedBack'
import { GetStats, StoreUnrecognizedTokens } from './actions'


class Dashboard extends React.Component {
  state = {
    tabValue: 0,
    showFeedback: false,
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
      Tokens,
    } = this.props

    const {
      match: prevMatch,
      Tokens: prevTokens,
    } = prevProps

    const coinbaseChanged = prevMatch.params.coinbase !== match.params.coinbase
    const tokensUpdated = Tokens.length !== prevTokens.length

    if (coinbaseChanged || tokensUpdated) {
      await this.updateRelayerStat(this.props.match.params.coinbase)
    }
  }

  async updateRelayerStat(coinbase) {
    const {
      Tokens,
      relayers,
    } = this.props

    const relayer = relayers[coinbase]
    const uniqueTokens = _.unique(relayer.from_tokens.concat(relayer.to_tokens)).map(t => t.toLowerCase())
    const unrecognizedTokens = uniqueTokens.filter(addr => !Tokens.find(t => _.strEqual(t.address, addr)))

    // NOTE: check for any remaining unrecognized tokens, get their Meta and save to Database first
    if (!_.isEmpty(unrecognizedTokens)) {
      const newTokensInfo = await Promise.all(unrecognizedTokens.map(getTokenInfo))
      return this.props.StoreUnrecognizedTokens(newTokensInfo)
    }

    const tokenMap = {}
    uniqueTokens.forEach(t => {
      tokenMap[t] = Tokens.find(item => _.strEqual(item.address, t))
    })
    return this.props.GetStats({ coinbase, tokens: tokenMap })
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
  Tokens: state.Tokens,
})

const actions = {
  GetStats,
  StoreUnrecognizedTokens,
}

export default connect(mapProps, actions)(Dashboard)
