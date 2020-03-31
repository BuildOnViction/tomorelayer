import React from 'react'
import { Box, Grid } from '@material-ui/core'
import * as _ from 'service/helper'
import TableControl from 'component/shared/TableControl'
import BlockStat from './StatComponents/BlockStat'
import VolumeChart from './StatComponents/VolumeChart'
import TokenChart from './StatComponents/TokenChart'
import ListRelayers from './StatComponents/ListRelayers'
import OrderFills from './StatComponents/OrderFills'
import TracedTokens from './StatComponents/TracedTokens'

const TOPICS = new _.TabMap('Relayer', 'Traced Tokens', 'Order fills')

class RelayerStat extends React.Component {

  state = {
    tab: TOPICS.relayer,
    totalOrders: 0,
  }

  onTabChange = (_, tab) => this.setState({ tab: TOPICS[tab] })

  updateTotalOrders = totalOrders => {
    this.setState({ totalOrders })
  }

  render() {

    const {
      relayer,
    } = this.props

    const {
      tab,
      totalOrders,
    } = this.state
    console.log('fdffdfdfd', TOPICS)
    const showRelayerTable = tab === TOPICS.relayer
    const showTracedTokensTable = tab === TOPICS.traced_tokens
    const showOrderFillsTable = tab === TOPICS.order_fills

    return (
      <Grid container spacing={4}>
        <Grid item xs={12} container direction="column">
          <BlockStat data={relayer.blockStats} />
          <Grid item className="mt-2" container spacing={4}>
            <Grid item xs={12} md={7}>
              <VolumeChart data={relayer.volumeChartData} coinbase={relayer.coinbase} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TokenChart data={relayer.tokenChartData} coinbase={relayer.coinbase} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className="mt-2" style={{ minHeight: 400 }}>
          <TableControl
            tabValue={TOPICS.getIndex(tab)}
            onTabChange={this.onTabChange}
            topics={TOPICS.values}
            textMask={[`Relayer (${totalOrders})`, `Traced Tokens (${relayer.tokenTableData.length})`, `Order fills (${totalOrders})`]}
            style={{ marginBottom: 20 }}
          />
          <Box className="mt-0" display="flex" justifyContent="center">
            {showRelayerTable && <ListRelayers />}
            {showTracedTokensTable && <TracedTokens tokens={relayer.tokenTableData} coinbase={relayer.coinbase} />}
            {showOrderFillsTable && <OrderFills coinbase={relayer.coinbase} updateTotal={this.updateTotalOrders} />}

          </Box>
        </Grid>
      </Grid>
    )
  }
}

export default RelayerStat

