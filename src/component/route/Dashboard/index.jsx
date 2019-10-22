import React from 'react'
import { connect } from 'redux-zero/react'
import { Box } from '@material-ui/core'
import * as _ from 'service/helper'
// import { ERC20TokenInfo as getTokenInfo } from 'service/blockchain'
import TabMenu from './TabMenu'
import RelayerStat from './RelayerStat'
import RelayerConfig from './RelayerConfig'
import FeedBack from './FeedBack'
import {
  StoreUnrecognizedTokens,
  getTradePairStat,
} from './actions'


class Dashboard extends React.Component {
  UNIQUE_TOKENS = []
  TOKEN_MAP = {}
  INTERVAL_UPDATE = undefined

  state = {
    tabValue: 0,
    showFeedback: false,
    blockStats: {
      volume24h: 'requesting data',
      totalFee: 'requesting data',
      tradeNumber: 'requesting data',
      tomoprice: 'requesting data',
    },
    tokenChartData: {},
    tokenTableData: [],
  }

  switchTab = (_, tabValue) => this.setState({
    tabValue,
    showFeedback: false,
  })

  switchFeedback = () => this.setState({ showFeedback: true })

  createUniqueTokenList = () => {
    const {
      match,
      relayers,
      Tokens,
    } = this.props
    const coinbase = match.params.coinbase
    const relayer = relayers[coinbase]
    this.UNIQUE_TOKENS = _.unique(relayer.from_tokens.concat(relayer.to_tokens)).map(t => t.toLowerCase())
    this.TOKEN_MAP = Tokens.reduce((map, tk) => ({
      ...map,
      [tk.symbol]: tk,
      [tk.address.toLowerCase()]: tk,
    }), {})
  }

  async componentDidMount() {
    this.createUniqueTokenList()
    await this.updateRelayerStat()
    this.INTERVAL_UPDATE = setInterval(async () => this.updateRelayerStat(), 10000)
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
      await this.updateRelayerStat()
    }
  }

  componentWillUnmount() {
    if (this.INTERVAL_UPDATE) {
      clearInterval(this.INTERVAL_UPDATE)
    }
  }

  async updateRelayerStat() {
    const {
      relayers,
      match,
      exchangeRates,
    } = this.props

    const coinbase = match.params.coinbase
    const relayer = relayers[coinbase]

    const stat = await getTradePairStat(
      relayer.from_tokens,
      relayer.to_tokens,
      this.TOKEN_MAP,
      exchangeRates,
      coinbase,
    )

    // NOTE: summary of 24h stat
    const uniqueFromTokens = _.unique(relayer.from_tokens)
    const summaryStat24h = uniqueFromTokens.reduce((acc, addr) => ({
      volume24h: (acc.volume24h || 0) + stat[addr.toLowerCase()].volume24h,
      totalFee: (acc.totalFee || 0) + stat[addr.toLowerCase()].totalFee,
      tradeNumber: (acc.tradeNumber || 0) + stat[addr.toLowerCase()].tradeNumber,
      tomoprice: exchangeRates.TOMO,
    }))

    const blockStats = {
      volume24h: `$ ${_.round(summaryStat24h.volume24h, 3).toLocaleString({ useGrouping: true })}`,
      // NOTE: if fee too small, format to wei/gwei
      totalFee: `$ ${_.round(summaryStat24h.totalFee, 3).toLocaleString({ useGrouping: true })}`,
      tradeNumber: summaryStat24h.tradeNumber,
      tomoprice: `$ ${_.round(summaryStat24h.tomoprice, 3).toLocaleString({ useGrouping: true })}`,
    }

    // NOTE: preparing visual data
    const tokenData = uniqueFromTokens.map(tk => ({
      label: this.TOKEN_MAP[tk.toLowerCase()].symbol,
      // NOTE: value is actually percentage of the token'share used in Token Chart
      value: _.round(stat[tk.toLowerCase()].volume24h * 100 / summaryStat24h.volume24h),
      // NOTE: the remaining keys are used in Token Table
      address: tk,
      symbol: this.TOKEN_MAP[tk.toLowerCase()].symbol,
      volume: _.round(stat[tk.toLowerCase()].volume24h, 3),
      trades: stat[tk.toLowerCase()].tradeNumber,
      // NOTE: price not calculated yet
      price: 0,
    })).sort((a, b) => {
      if (a.value > b.value) {
        return -1
      }

      return a.volume > b.volume ? -1 : 1
    })

    this.setState({
      blockStats,
      tokenChartData: {
        ...this.state.tokenChartData,
        _24h: tokenData,
      },
      tokenTableData: tokenData,
    })
  }

  render() {

    const {
      relayers,
      match,
    } = this.props

    const {
      blockStats,
      tabValue,
      showFeedback,
      tokenChartData,
      tokenTableData,
    } = this.state

    const relayer = relayers[match.params.coinbase] || relayers[0]

    const statObject = {
      ...relayer,
      blockStats,
      tokenChartData,
      tokenTableData,
    }

    return (
      <Box style={{ transform: 'translateY(-30px)' }}>
        <TabMenu
          onChange={this.switchTab}
          value={tabValue}
          switchFeedback={this.switchFeedback}
        />
        <Box className="mt-2">
          {!showFeedback && tabValue === 0 && <RelayerStat relayer={statObject} />}
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
  exchangeRates: {
    TOMO: state.network_info.tomousd,
    BTC: state.network_info.btcusd,
  }
})

const actions = {
  StoreUnrecognizedTokens,
}

export default connect(mapProps, actions)(Dashboard)
