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
import networkFeeIcon from 'asset/icon-network-fees.png'
import networkVolIcon from 'asset/icon-network-volume.png'
import tradeIcon from 'asset/icon-trades.png'
import tomoPriceIcon from 'asset/icon-tomo-price.png'

import {
  StyledLink,
} from 'component/shared/Adapters'
import * as _ from 'service/helper'
import { PushAlert } from 'service/frontend'

import TableControl from 'component/shared/TableControl'
import StatCard from './StatCard'
import VolumeChart from './VolumeChart'
import TokenChart from './TokenChart'
import OrderTable from './OrderTable'
import TokenTable from './TokenTable'

import {
  GetStats,
} from './actions'

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

const TOPICS = new _.TabMap('Orders', 'Tokens')

class RelayerStat extends React.Component {

  state = {
    tab: TOPICS.orders,
    loading: true,
  }

  onTabChange = (_, tab) => this.setState({ tab: TOPICS[tab] })

  render() {
    const {
      relayer,
      stats,
    } = this.props

    const {
      tab,
      loading,
    } = this.state

    const avatarClassName = cx({ 'empty-avatar': _.isEmpty(relayer.logo) })

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
                {!_.isEmpty(relayer.link) && (
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
            <StatCard icon={networkVolIcon} stat="1000" helpText="Network Volume" />
            <StatCard icon={networkFeeIcon} stat="1000" helpText="Network Fees" />
            <StatCard icon={tradeIcon} stat="1000" helpText="Trades(24h)" />
            <StatCard icon={tomoPriceIcon} stat="1000" helpText="Tomo Price" />
          </Grid>

          <Grid item className="mt-2" container spacing={4}>
            <Grid item xs={12} md={7}>
              <VolumeChart loading={loading} data={stats.volume} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TokenChart loading={loading} data={stats.token} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className="mt-2" style={{ minHeight: 400 }}>
          <TableControl
            tabValue={TOPICS.getIndex(tab)}
            onTabChange={this.onTabChange}
            topics={TOPICS.values}
          />
          <Box className="mt-0" display="flex" justifyContent="center">
            {loading && <CircularProgress style={{ width: 50, height: 50, margin: '10em auto' }}/>}
            {!loading && tab === TOPICS.orders && <OrderTable data={stats.trades} />}
            {!loading && tab === TOPICS.tokens && <TokenTable data={stats.tokens} />}
          </Box>
        </Grid>
      </Grid>
    )
  }
}

const mapProps = state => ({
  stats: {
    volume: [],
    token: [],
    trades: [],
    tokens: [],
    tomousd: state.network_info.tomousd,
  },
  AvailableTokens: state.Tokens,
})

const actions = {
  GetStats,
  PushAlert,
}

export default connect(mapProps, actions)(RelayerStat)
