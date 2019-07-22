import React from 'react'
import {
  Grid,
} from '@material-ui/core'
import StatCard from './StatCard'
import TimeVolumeStat from './TimeVolumeStat'
import {
  statcard_mock,
} from './mock.data'

const Main = () => (
  <Grid container spacing={8}>
    <Grid item container justify="space-between" alignItems="center" spacing={8}>
      {statcard_mock.map(t => <StatCard key={t.helpText} {...t} />)}
    </Grid>
    <Grid item container>
      <Grid item sm={12} md={7}>
        <TimeVolumeStat />
      </Grid>
    </Grid>
  </Grid>
)

export default Main
