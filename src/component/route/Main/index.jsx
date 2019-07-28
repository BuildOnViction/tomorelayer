import React from 'react'
import {
  Grid,
} from '@material-ui/core'
import { TabMap } from 'service/helper'
import TableControl from 'component/shared/TableControl'
import StatCard from './StatCard'
import TimeVolumeStat from './TimeVolumeStat'
import TokenChart from './TokenChart'
import RelayerTable from './RelayerTable'
import {
  statcard_mock,
} from './mock.data'

const TOPICS = new TabMap('Relayers', 'Fills', 'Tokens')

const Main = () => {
  const [tab, setTab] = React.useState(TOPICS.relayers)
  const onTabChange = (_, tab) => setTab(TOPICS[tab])

  return (
    <Grid container spacing={8}>
      <Grid item container justify="space-between" alignItems="center" spacing={4}>
        {statcard_mock.map(t => <StatCard key={t.helpText} {...t} />)}
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
          {TOPICS.getByIndex(tab) === TOPICS.relayers && <RelayerTable />}
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Main
