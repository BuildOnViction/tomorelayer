import React from 'react'
import { connect } from 'redux-zero/react'
import { Box } from '@material-ui/core'
import * as d from 'date-fns'
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
    await this.requestRelayerStat()
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
      await this.requestRelayerStat()
    }
  }

  componentWillUnmount() {
    if (this.INTERVAL_UPDATE) {
      clearInterval(this.INTERVAL_UPDATE)
    }
  }

  async getBlockStatAndTokenTableData() {
    const {
      relayers,
      match,
      exchangeRates,
    } = this.props

    const coinbase = match.params.coinbase
    const relayer = relayers[coinbase]

    const result = await getTradePairStat(
      relayer.from_tokens,
      relayer.to_tokens,
      this.TOKEN_MAP,
      exchangeRates,
      coinbase,
    )

    const totalVolume24h = Object.values(result).reduce((sum, item) => sum + item.volume24h, 0)
    const totalTrade24h = Object.values(result).reduce((sum, item) => sum + item.tradeNumber, 0)
    const totalFee24h = Object.values(result).reduce((sum, item) => sum + item.totalFee, 0)

    const TokenTableData = Object.values(result).map(meta => ({
      address: meta.fromAddress,
      symbol: meta.fromSymbol,
      volume: _.round(meta.volume24h, 3),
      trades: meta.tradeNumber,
      price: 0,
    })).sort((a, b) => a.volume > b.volume ? -1 : 1)

    const Last24hStat = {
      volume24h: `$ ${_.round(totalVolume24h, 3).toLocaleString({ useGrouping: true })}`,
      totalFee: `$ ${_.round(totalFee24h, 3).toLocaleString({ useGrouping: true })}`,
      tradeNumber: totalTrade24h,
      tomoprice: `$ ${_.round(exchangeRates.TOMO, 3)}`,
    }

    console.log(Last24hStat)
    return [Last24hStat, TokenTableData]
  }

  async updateRelayerStat() {
    const {
      relayers,
      match,
      exchangeRates,
    } = this.props

    const coinbase = match.params.coinbase
    const relayer = relayers[coinbase]

    const result = await getTradePairStat(
      relayer.from_tokens,
      relayer.to_tokens,
      this.TOKEN_MAP,
      exchangeRates,
      coinbase,
      { date: d.format(Date.now(), "YYYY-MM-DD") }
    )

    const totalVolume24h = Object.values(result).reduce((sum, item) => sum + item.volume24h, 0)

    // Update charts: volumeChartData
    // NOTE: we do not update TokenShare-Chart of 7d & 1M for now
    // because the computing might be quite complex
    const {
      volumeChartData,
    } = this.state
    volumeChartData._7d[6] = volumeChartData._1M[29] = {
      label: d.format(Date.now(), "MMM DD"),
      value: _.round(totalVolume24h, 3),
    }

    const [blockStats, tokenTableData] = await this.getBlockStatAndTokenTableData()

    this.setState({
      volumeChartData,
      blockStats,
      tokenTableData,
    })
  }

  async requestRelayerStat() {
    const {
      relayers,
      match,
      exchangeRates,
    } = this.props

    const coinbase = match.params.coinbase
    const relayer = relayers[coinbase]

    const volumeChartData = {}
    const [volumeStat, tokenChartData] = await getVolumesOverTime(
      relayer.from_tokens,
      relayer.to_tokens,
      this.TOKEN_MAP,
      exchangeRates,
      coinbase,
    )
    volumeChartData._7d = volumeStat.slice(23)
    volumeChartData._1M = volumeStat

    const [blockStats, tokenTableData] = await this.getBlockStatAndTokenTableData()

    this.setState({
      blockStats,
      tokenChartData,
      volumeChartData,
      tokenTableData,
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
