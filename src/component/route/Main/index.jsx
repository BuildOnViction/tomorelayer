import React from 'react'
import {
  Grid,
} from '@material-ui/core'
import StatCard from './StatCard'
import TimeVolumeStat from './TimeVolumeStat'
import TokenChart from './TokenChart'
import {
  statcard_mock,
} from './mock.data'

const Main = () => (
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
    <Grid item sm={12}>
      table goes here...
    </Grid>
  </Grid>
)

export default Main
