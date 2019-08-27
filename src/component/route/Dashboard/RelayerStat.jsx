import React from 'react'
// import * as datefns from 'date-fns'
import { connect } from 'redux-zero/react'
import {
  Avatar,
  Box,
  CircularProgress,
  Grid,
  Typography,
} from '@material-ui/core'
import cx from 'classnames'
import { withStyles } from '@material-ui/styles'

import placeholder from 'asset/image-placeholder.png'
import networkFeeIcon from 'asset/icon-network-fees.png'
import networkVolIcon from 'asset/icon-network-volume.png'
import tradeIcon from 'asset/icon-trades.png'
import tomoPriceIcon from 'asset/icon-tomo-price.png'

import * as _ from 'service/helper'
import * as http from 'service/backend'
import {
  AlertVariant,
  PushAlert,
}from 'service/frontend'

import { StyledLink } from 'component/shared/Adapters'
import { isEmpty, TabMap } from 'service/helper'
import TableControl from 'component/shared/TableControl'
import StatCard from './StatCard'
import TimeVolumeStat from './TimeVolumeStat'

import OrderTable from './OrderTable'
import TokenTable from './TokenTable'


const StyledAvatar = withStyles(theme => ({
  root: {
    height: 60,
    width: 60,
    borderRadius: '50%',
    marginRight: 20,
    '&.empty-avatar': {
      border: `solid 3px ${theme.palette.paper}`,
      padding: 20,
      background: `${theme.palette.paper}80`
    }
  }
}))(Avatar)

const TOPICS = new TabMap('Orders', 'Tokens')

class RelayerStat extends React.Component {
  state = {
    tab: TOPICS.orders,
  }

  async componentDidMount() {
    if (this.props.relayer.link) {
      const getData = await this.getRelayerStat()
      console.log(getData)
    }
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.relayer.coinbase !== this.props.relayer.coinbase) {
      const getData = await this.getRelayerStat()
      console.log(getData)
    }
  }

  getRelayerStat = async () => {
    const {
      relayer,
    } = this.props

    if (_.isEmpty(relayer.link)) {
      return undefined
    }

    const data = await http.getDexTrades(relayer.link, {
      sortType: 'dec',
      sortBy: 'time',
    })

    if (data.error) {
      console.log(data.error)
      return this.props.alert({
        variant: AlertVariant.error,
        message: `Unable to get stat from Relayer's link`
      })
    }

    return data.trades || data
  }

  onTabChange = (_, tab) => this.setState({ tab: TOPICS[tab] })

  render() {
    const {
      AvailableTokens,
      relayer,
      stats,
    } = this.props

    const {
      tab,
    } = this.state

    const unifiedTokens = _.unique([...relayer.from_tokens, ...relayer.to_tokens])
    const listedTokens = AvailableTokens.filter(t => unifiedTokens.indexOf(t.address) >= 0)

    const mockChartData = () => new Array(80).fill().map((_, idx) => ({
      label: idx % 5 === 0 ? 'abc' : '',
      value: Math.random() * 2500 + 500,
    }))

    const relayerStat = {
      tomousd: `$${_.round(stats.tomousd, 2)}`,
      trades: (!_.isEmpty(stats.trades) && stats.trades[relayer.coinbase]) || 1000,
      fees: (!_.isEmpty(stats.fees) && stats.fees[relayer.coinbase]) || '1000 TOMO',
      volumes: stats.volumes || mockChartData(),
      fills: stats.fills || mockChartData(),
    }

    const avatarClassName = cx({ 'empty-avatar': isEmpty(relayer.logo) })

    if (_.isEmpty(relayer)) {
      return (
        <Grid container direction="column" spacing={4} justify="center">
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      )
    }

    return (
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Box>
              <StyledAvatar src={relayer.logo || placeholder} alt={relayer.name} className={avatarClassName} />
            </Box>
            <Box display="flex" flexDirection="column">
              <Box>
                <Typography variant="h6" className="mb-0">
                  {relayer.name}
                </Typography>
              </Box>
              <Box>
                {!isEmpty(relayer.link) && (
                  <StyledLink href={relayer.link} rel="noopener noreferrer" target="_blank">
                    {relayer.link}
                  </StyledLink>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>

        <Grid item xs={12} container direction="column">
          <Grid item container spacing={4}>
            <StatCard icon={networkVolIcon} stat={`$${_.round(stats.tomoprice, 2)}`} helpText="Network Volume" />
            <StatCard icon={networkFeeIcon} stat={`$${_.round(stats.tomoprice, 2)}`} helpText="Network Fees" />
            <StatCard icon={tradeIcon} stat={`$${_.round(stats.tomoprice, 2)}`} helpText="Trades(24h)" />
            <StatCard icon={tomoPriceIcon} stat={`$${_.round(stats.tomoprice, 2)}`} helpText="Tomo Price" />
          </Grid>

          <Grid item className="mt-2">
            <TimeVolumeStat data={relayerStat} />
          </Grid>
        </Grid>

        <Grid item xs={12} className="mt-2" style={{ minHeight: 400 }}>
          <TableControl
            tabValue={TOPICS.getIndex(tab)}
            onTabChange={this.onTabChange}
            topics={TOPICS.values}
          />
          <Box className="mt-0">
            {tab === TOPICS.orders && <OrderTable />}
            {tab === TOPICS.tokens && <TokenTable relayer={relayer} tokens={listedTokens} />}
          </Box>
        </Grid>
      </Grid>
    )
  }
}

const mapProps = state => ({
  stats: {
    tomousd: state.network_info.tomousd,
    trades: state.network_info.trades,
  },
  AvailableTokens: state.Tokens,
})

const actions = {
  alert: PushAlert
}

export default connect(mapProps, actions)(RelayerStat)
