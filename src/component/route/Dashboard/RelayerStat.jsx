import React from 'react'
import { Box, CircularProgress, Grid } from '@material-ui/core'
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
  }

  onTabChange = (_, tab) => this.setState({ tab: TOPICS[tab] })

  render() {

    const {
      relayer,
    } = this.props

    const {
      tab,
    } = this.state

    const tokenTableData = Object.values(relayer.tokenMap || {})

    const showOrderTable = tab === TOPICS.orders && Boolean(relayer.stat && relayer.stat.orderTableData)
    const showTokenTable = tab === TOPICS.tokens && Boolean(relayer.stat && relayer.stat.tokenTableData)

    const {
      volume24h,
      totalFee,
      tradeNumber,
      tomoprice,
      tokenShares,
    } = (relayer.stat || {})

    const formattedStat = {
      volume24h: volume24h ? `$ ${_.round(volume24h, 3).toLocaleString({ useGrouping: true })}` : 'requesting data',
      // NOTE: if fee too small, format to wei/gwei
      totalFee: totalFee ? `$ ${_.round(totalFee, 3).toLocaleString({ useGrouping: true })}` : 'requesting data',
      tradeNumber: tradeNumber ? tradeNumber : 'requesting data',
      tomoprice: tomoprice ? `$ ${_.round(tomoprice, 3).toLocaleString({ useGrouping: true })}` : 'requesting data',
    }

    return (
      <Grid container spacing={4}>
        <RelayerHeader relayer={relayer} />
        <Grid item xs={12} container direction="column">
          <BlockStat data={formattedStat} />
          <Grid item className="mt-2" container spacing={4}>
            <Grid item xs={12} md={7}>
              <VolumeChart data={null} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TokenChart data={tokenShares} />
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
            {!showOrderTable && !showTokenTable && <CircularProgress style={{ width: 50, height: 50, margin: '10em auto' }}/>}
            {showOrderTable && <OrderTable data={null} />}
            {showTokenTable && <TokenTable tokens={relayer.stat.tokenTableData} coinbase={relayer.coinbase} />}
          </Box>
        </Grid>
      </Grid>
    )
  }
}

export default RelayerStat
