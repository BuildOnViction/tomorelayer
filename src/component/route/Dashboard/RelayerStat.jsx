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
    loading: true,
  }

  onTabChange = (_, tab) => this.setState({ tab: TOPICS[tab] })

  render() {

    const {
      relayer,
    } = this.props

    const {
      tab,
      loading,
    } = this.state

    const tokenTableData = Object.values(relayer.tokenMap || {})

    const showOrderTable = tab === TOPICS.orders && Boolean(relayer.stat && relayer.stat.orders)
    const showTokenTable = tab === TOPICS.tokens && Boolean(relayer.stat && relayer.stat.tokenMap)

    const formattedStat = {
      volume24h: relayer.stat && relayer.stat.volume24h ? `$ ${_.round(relayer.stat.volume24h, 3)}` : 'requesting data',
      // NOTE: if fee too small, format to wei/gwei
      totalFee: relayer.stat && relayer.stat.totalFee ? `${_.round(relayer.stat.totalFee, 3)} TOMO` : 'requesting data',
      tradeNumber: relayer.stat && relayer.stat.tradeNumber,
      tomoprice: relayer.stat && relayer.stat.tomoprice ? `$ ${_.round(relayer.stat.tomoprice, 3)}` : 'requesting data',
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
              <TokenChart data={null} />
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
            {showOrderTable && <OrderTable data={null} />}
            {showTokenTable && <TokenTable relayer={null} />}
          </Box>
        </Grid>
      </Grid>
    )
  }
}

export default RelayerStat
