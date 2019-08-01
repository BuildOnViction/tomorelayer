import React from 'react'
import { connect } from 'redux-zero/react'
import {
  Grid,
} from '@material-ui/core'
import { TabMap, round } from 'service/helper'
import TableControl from 'component/shared/TableControl'
import StatCard from './StatCard'
import TimeVolumeStat from './TimeVolumeStat'
import TokenChart from './TokenChart'
import RelayerTable from './RelayerTable'
import networkFeeIcon from 'asset/icon-network-fees.png'
import networkVolIcon from 'asset/icon-network-volume.png'
import tradeIcon from 'asset/icon-trades.png'
import tomoPriceIcon from 'asset/icon-tomo-price.png'


const TOPICS = new TabMap('Relayers', 'Fills', 'Tokens')

const Home = ({
  network,
}) => {
  const [tab, setTab] = React.useState(TOPICS.relayers)
  const onTabChange = (_, tab) => setTab(TOPICS[tab])

  return (
    <Grid container spacing={8}>
      <Grid item container justify="space-between" alignItems="center" spacing={4}>
        <StatCard icon={networkVolIcon} stat={`$${round(network.tomoprice, 2)}`} helpText="Network Volume" />
        <StatCard icon={networkFeeIcon} stat={`$${round(network.tomoprice, 2)}`} helpText="Network Fees" />
        <StatCard icon={tradeIcon} stat={`$${round(network.tomoprice, 2)}`} helpText="Trades(24h)" />
        <StatCard icon={tomoPriceIcon} stat={`$${round(network.tomoprice, 2)}`} helpText="Tomo Price" />
      </Grid>
      <Grid item container spacing={4}>
        <Grid item sm={12} md={7}>
          <TimeVolumeStat />
        </Grid>
        <Grid item sm={12} md={5}>
          <TokenChart />
        </Grid>
      </Grid>
      <Grid item sm={12} container direction="column">
        <Grid item className="mb-2">
          <TableControl tabValue={TOPICS.getIndex(tab)} onTabChange={onTabChange} topics={TOPICS.values} />
        </Grid>
        <Grid item>
          {tab === TOPICS.relayers && <RelayerTable />}
        </Grid>
      </Grid>
    </Grid>
  )
}

const mapProps = state => ({
  network: {
    tomoprice: state.network_info.tomousd
  }
})

const connected = connect(mapProps)

export default connected(Home)
