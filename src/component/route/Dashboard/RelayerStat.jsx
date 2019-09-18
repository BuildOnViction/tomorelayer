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
import wretch from 'wretch'
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

  async componentDidMount() {
    const coinbase = '0x0D3ab14BBaD3D99F4203bd7a11aCB94882050E7e' || this.props.relayer.coinbase
    const trades = await wretch(`http://167.71.222.219/api/trades/listByDex/${coinbase}`).get().json()
    this.props.saveStat({
      type: 'trades',
      data: {
        ...trades,
        items: {
          1: trades.items.slice(0, 10),
          2: trades.items.slice(10, 20),
        }
      },
      coinbase: this.props.relayer.coinbase,
    })
    this.setState({ loading: false })
  }

  requestData = type => async page => {
    // NOTE: saving to localStorage..
    if (type === 'trades') {
      const coinbase = '0x0D3ab14BBaD3D99F4203bd7a11aCB94882050E7e' || this.props.relayer.coinbase
      const trades = await wretch(`http://167.71.222.219/api/trades/listByDex/${coinbase}?page=${page}`).get().json()
      const currentTrades = this.props.stats.trades
      const stats = {
        type: 'trades',
        data: {
          ...currentTrades.data,
          items: {
            ...currentTrades.data.items,
            [page * 2 - 1]: trades.items.slice(0, 10),
            [page * 2]: trades.items.slice(10, 20),
          },
        },
        coinbase: this.props.relayer.coinbase,
      }
      console.log(stats)
      // this.props.saveStat()
    }
  }

  render() {

    const {
      relayer,
      stats,
      AvailableTokens,
    } = this.props

    const {
      tab,
      loading,
    } = this.state

    const tokenTableData = _.unique(relayer.from_tokens.concat(relayer.to_tokens))
                            .map(t => AvailableTokens.find(token => token.address === t))
                            .filter(_.isTruthy)

    const avatarClassName = cx({ 'empty-avatar': _.isEmpty(relayer.logo) })

    console.log(stats)
    const shouldShowOrderTable = tab === TOPICS.orders && Boolean(stats[relayer.coinbase])
    const shouldShowTokenTable = tab === TOPICS.tokens && Boolean(stats[relayer.coinbase])

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
            <StatCard icon={networkVolIcon} stat="$ 4389" helpText="Relayer Volume 24h" />
            <StatCard icon={networkFeeIcon} stat="290 TOMO" helpText="Relayer Fee 24h" />
            <StatCard icon={tradeIcon} stat="5323" helpText="Trades(24h)" />
            <StatCard icon={tomoPriceIcon} stat={`$ ${stats.tomousd}`} helpText="Tomo Price" />
          </Grid>

          <Grid item className="mt-2" container spacing={4}>
            <Grid item xs={12} md={7}>
              <VolumeChart data={stats.volume} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TokenChart data={stats.token} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className="mt-2" style={{ minHeight: 400 }}>
          <TableControl
            tabValue={TOPICS.getIndex(tab)}
            onTabChange={this.onTabChange}
            topics={TOPICS.values}
            textMask={['Orders', `Tokens (${tokenTableData.length})`]}
            style={{ marginBottom: 20 }}
          />
          <Box className="mt-0" display="flex" justifyContent="center">
            {loading && <CircularProgress style={{ width: 50, height: 50, margin: '10em auto' }}/>}
            {shouldShowOrderTable && (
              <OrderTable
                data={stats[relayer.coinbase].trades}
                requestData={this.requestData('trades')}
              />
            )}
            {shouldShowTokenTable && (
              <TokenTable
                tokens={tokenTableData}
                relayer={relayer}
              />
            )}
          </Box>
        </Grid>
      </Grid>
    )
  }
}

const mapProps = state => ({
  stats: {
    ...state.user.stats,
    tomousd: state.network_info.tomousd,
  },
  AvailableTokens: state.Tokens,
})

const actions = {
  GetStats,
  PushAlert,
  saveStat: (state, { type, data, coinbase }) => ({
    user: {
      ...state.user,
      stats: {
        ...state.user.stats,
        [coinbase]: {
          ...state.user.stats[coinbase],
          [type]: data,
        }
      }
    },
  })
}

export default connect(mapProps, actions)(RelayerStat)
