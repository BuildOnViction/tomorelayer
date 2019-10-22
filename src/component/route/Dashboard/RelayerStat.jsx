import React from 'react'
import { Box, Grid } from '@material-ui/core'
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

    const showOrderTable = tab === TOPICS.orders
    const showTokenTable = tab === TOPICS.tokens && !_.isEmpty(relayer.tokenTableData)

    return (
      <Grid container spacing={4}>
        <RelayerHeader relayer={relayer} />
        <Grid item xs={12} container direction="column">
          <BlockStat data={relayer.blockStats} />
          <Grid item className="mt-2" container spacing={4}>
            <Grid item xs={12} md={7}>
              <VolumeChart data={null} />
            </Grid>
            <Grid item xs={12} md={5}>
              <TokenChart data={relayer.tokenChartData} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} className="mt-2" style={{ minHeight: 400 }}>
          <TableControl
            tabValue={TOPICS.getIndex(tab)}
            onTabChange={this.onTabChange}
            topics={TOPICS.values}
            textMask={[`Orders (${totalOrders})`, `Tokens (${relayer.tokenTableData.length})`]}
            style={{ marginBottom: 20 }}
          />
          <Box className="mt-0" display="flex" justifyContent="center">
            {showOrderTable && <OrderTable coinbase={relayer.coinbase} updateTotal={this.updateTotalOrders} />}
            {showTokenTable && <TokenTable tokens={relayer.tokenTableData} coinbase={relayer.coinbase} />}
          </Box>
        </Grid>
      </Grid>
    )
  }
}

export default RelayerStat
