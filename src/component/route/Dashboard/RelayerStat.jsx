import React from 'react'
import { connect } from 'redux-zero/react'
import {
  Avatar,
  Box,
  Grid,
  Typography,
} from '@material-ui/core'
import cx from 'classnames'
import { withStyles } from '@material-ui/styles'
import placeholder from 'asset/image-placeholder.png'
import IconTomoPrice from 'asset/icon-tomo-price.png'
import IconTrades from 'asset/icon-trades.png'
import IconFees from 'asset/icon-network-fees.png'

import * as _ from 'service/helper'
import { StyledLink } from 'component/shared/Adapters'
import { isEmpty, TabMap } from 'service/helper'
import TableControl from 'component/shared/TableControl'
import StatCard from './StatCard'
import TimeVolumeStat from './TimeVolumeStat'
// import OrderTable from './OrderTable'


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

  onTabChange = (_, tab) => this.setState({ tab: TOPICS[tab] })

  render() {
    const {
      relayers: allRelayers,
      match,
      stats,
    } = this.props

    const {
      tab,
    } = this.state

    const coinbase = match.params.coinbase
    const relayer = allRelayers[coinbase]

    const relayerStat = {
      tomousd: `$${_.round(stats.tomousd, 2)}`,
      trades: (!_.isEmpty(stats.trades) && stats.trades[relayer.coinbase]) || 1000,
      fees: (!_.isEmpty(stats.fees) && stats.fees[relayer.coinbase]) || '1000 TOMO',
    }

    const avatarClassName = cx({ 'empty-avatar': isEmpty(relayer.logo) })

    return (
      <Grid container direction="column" spacing={4}>
        <Grid item>
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
        <Grid item container spacing={3}>
          <Grid item container xs={12} sm={4} md={3} spacing={3} direction="column">
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
          <Grid item xs={12} sm={8} md={9} className="pr-0">
            <TimeVolumeStat />
          </Grid>
        </Grid>
        <Grid item className="mt-1" style={{ minHeight: 400 }}>
          <TableControl tabValue={TOPICS.getIndex(tab)} onTabChange={this.onTabChange} topics={TOPICS.values} />
          <Box className="mt-2">
            Your relayer hasn't has any order yet
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
})

export default connect(mapProps)(RelayerStat)
