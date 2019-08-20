import React from 'react'
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
import IconTomoPrice from 'asset/icon-tomo-price.png'
import IconTrades from 'asset/icon-trades.png'
import IconFees from 'asset/icon-network-fees.png'
import * as http from 'service/backend'
import * as _ from 'service/helper'
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

  async componentDidUpdate(prevProps) {
    if (prevProps.relayer.coinbase !== this.props.relayer.coinbase) {
      const getData = await this.getRelayerStat()
      console.log(getData)
    }
  }

  getRelayerStat = async () => {
    const { relayer } = this.props

    if (_.isEmpty(relayer.link)) {
      return undefined
    }

    const result = await Promise.all(relayer.from_tokens.map(async (token, idx) => {
      const data = await http.getDexTrades(relayer.link, {
        quoteToken: token,
        baseToken: relayer.to_tokens[idx]
      })
      return data
    }))
    return result
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
      <Grid container direction="column" spacing={4}>
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

        <Grid item item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} md={3}>
              <Grid container spacing={3} direction="column">
                <Grid item>
                  <StatCard icon={IconFees} stat={relayerStat.fees} helpText="Fees(24h)" />
                </Grid>
                <Grid item>
                  <StatCard icon={IconTrades} stat={relayerStat.trades} helpText="Trades (24h)" />
                </Grid>
                <Grid item>
                  <StatCard icon={IconTomoPrice} stat={relayerStat.tomousd} helpText="Tomo Price" />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={8} md={9}>
              <TimeVolumeStat data={relayerStat} />
            </Grid>
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

export default connect(mapProps)(RelayerStat)
