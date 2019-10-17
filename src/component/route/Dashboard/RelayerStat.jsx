import React from 'react'
import { connect } from 'redux-zero/react'
import {
  Box,
  CircularProgress,
  Grid,
} from '@material-ui/core'
import * as _ from 'service/helper'
import TableControl from 'component/shared/TableControl'
import RelayerHeader from './StatComponents/RelayerHeader'
import BlockStat from './StatComponents/BlockStat'
import VolumeChart from './StatComponents/VolumeChart'
import TokenChart from './StatComponents/TokenChart'
import OrderTable from './StatComponents/OrderTable'
import TokenTable from './StatComponents/TokenTable'

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
      AvailableTokens,
    } = this.props

    const {
      tab,
      loading,
    } = this.state

    const tokenTableData = _.unique(relayer.from_tokens.concat(relayer.to_tokens))
                            .map(t => AvailableTokens.find(token => token.address === t))
                            .filter(_.isTruthy)

    const showOrderTable = tab === TOPICS.orders && Boolean(stats[relayer.coinbase])
    const showTokenTable = tab === TOPICS.tokens && Boolean(stats[relayer.coinbase])

    return (
      <Grid container spacing={4}>
        <RelayerHeader relayer={relayer} />
        <Grid item xs={12} container direction="column">
          <BlockStat data={relayer.stat} />
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
            {showOrderTable && (
              <OrderTable
                data={stats[relayer.coinbase].trades}
                requestData={this.requestData('trades')}
              />
            )}
            {showTokenTable && (
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

export default connect(mapProps)(RelayerStat)
