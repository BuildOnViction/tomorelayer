import React from 'react'
// import * as datefns from 'date-fns'
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
import networkFeeIcon from 'asset/icon-network-fees.png'
import networkVolIcon from 'asset/icon-network-volume.png'
import tradeIcon from 'asset/icon-trades.png'
import tomoPriceIcon from 'asset/icon-tomo-price.png'

import { StyledLink } from 'component/shared/Adapters'
import { isEmpty, TabMap } from 'service/helper'
import TableControl from 'component/shared/TableControl'
import StatCard from './StatCard'
import VolumeChart from './VolumeChart'
import TokenChart from './TokenChart'

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

  onTabChange = (_, tab) => this.setState({ tab: TOPICS[tab] })

  render() {
    const {
      relayer,
    } = this.props

    const {
      tab,
    } = this.state

    const avatarClassName = cx({ 'empty-avatar': isEmpty(relayer.logo) })

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
            <StatCard icon={networkVolIcon} stat="1000" helpText="Network Volume" />
            <StatCard icon={networkFeeIcon} stat="1000" helpText="Network Fees" />
            <StatCard icon={tradeIcon} stat="1000" helpText="Trades(24h)" />
            <StatCard icon={tomoPriceIcon} stat="1000" helpText="Tomo Price" />
          </Grid>

          <Grid item className="mt-2" container spacing={4}>
            <Grid item xs={12} md={7}>
              <VolumeChart coinbase={relayer.coinbase} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TokenChart coinbase={relayer.coinbase} />
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
            {tab === TOPICS.orders && <OrderTable coinbase={relayer.coinbase} />}
            {tab === TOPICS.tokens && <TokenTable coinbase={relayer.coinbase} />}
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
