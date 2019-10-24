import React from 'react'
import { connect } from 'redux-zero/react'
import { Box } from '@material-ui/core'
import * as _ from 'service/helper'
// import { ERC20TokenInfo as getTokenInfo } from 'service/blockchain'
import { CircleSpinner } from 'component/utility'
import TabMenu from './TabMenu'
import RelayerStat from './RelayerStat'
import RelayerConfig from './RelayerConfig'
import FeedBack from './FeedBack'
import {
  StoreUnrecognizedTokens,
  getTradePairStat,
  getVolumesOverTime,
} from './actions'


class Dashboard extends React.Component {
  UNIQUE_TOKENS = []
  TOKEN_MAP = {}
  INTERVAL_UPDATE = undefined

  state = {
    tabValue: 0,
    showFeedback: false,
    blockStats: {
      volume24h: <CircleSpinner />,
      totalFee: <CircleSpinner />,
      tradeNumber: <CircleSpinner />,
      tomoprice: <CircleSpinner />,
    },
    tokenChartData: {},
    volumeChartData: {},
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
    // TODO: detect unrecognize token and save it to DB
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
    // NOTE: to be more informative, we update data every 10 seconds
    // in the future, user may be able to adjust this updating interval
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

    const volumeChartData = { ...this.state.volumeChartData }
    if (!this.state.volumeChartData._7d) {
      const volumeStat = await getVolumesOverTime(
        relayer.from_tokens,
        relayer.to_tokens,
        this.TOKEN_MAP,
        exchangeRates,
        coinbase,
      )
      volumeChartData._7d = volumeStat.slice(23)
      volumeChartData._1M = volumeStat
    }

    // NOTE: summary of 24h stat
    const uniqueFromTokens = _.unique(relayer.from_tokens).map(t => t.toLowerCase())
    const summaryStat24h = uniqueFromTokens.reduce((acc, address) => ({
      volume24h: acc.volume24h + stat[address].volume24h,
      totalFee: acc.totalFee + stat[address].totalFee,
      tradeNumber: acc.tradeNumber + stat[address].tradeNumber,
      tomoprice: exchangeRates.TOMO,
    }), {
      volume24h: 0,
      totalFee: 0,
      tradeNumber: 0,
      tomoprice: exchangeRates.TOMO,
    })

    const totalVolume24h = summaryStat24h.volume24h
    const blockStats = {
      volume24h: `$ ${_.round(totalVolume24h, 3).toLocaleString({ useGrouping: true })}`,
      // NOTE: if fee too small, format to wei/gwei
      totalFee: `$ ${_.round(summaryStat24h.totalFee, 3).toLocaleString({ useGrouping: true })}`,
      tradeNumber: summaryStat24h.tradeNumber,
      tomoprice: `$ ${_.round(summaryStat24h.tomoprice, 3)}`,
    }

    // NOTE: preparing visual data
    const tokenData = uniqueFromTokens.map(address => ({
      label: this.TOKEN_MAP[address].symbol,
      // NOTE: value is actually percentage of the token'share used in Token Chart
      value: totalVolume24h > 0 ? _.round(stat[address].volume24h * 100 / totalVolume24h) : 0,
      // NOTE: the remaining keys are used in Token Table
      address: address,
      symbol: this.TOKEN_MAP[address].symbol,
      volume: _.round(stat[address].volume24h, 3),
      trades: stat[address].tradeNumber,
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
      volumeChartData,
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
      volumeChartData,
    } = this.state

    const relayer = relayers[match.params.coinbase] || relayers[0]

    const statObject = {
      ...relayer,
      blockStats,
      tokenChartData,
      tokenTableData,
      volumeChartData,
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
    ETH: state.network_info.ethusd,
  }
})

const actions = {
  StoreUnrecognizedTokens,
}

export default connect(mapProps, actions)(Dashboard)
