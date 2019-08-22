import React from 'react'
import { Grid, Paper, Typography } from '@material-ui/core'

const StatCard = ({
  icon,
  stat,
  helpText,
}) => (
  <Grid item sm={3}>
    <Paper elevation={0} className="">
      <Grid container spacing={2}>
        <Grid item sm={12} container justify="center">
          <img alt="" src={icon} height="26px" className="mt-1" />
        </Grid>
        <Grid item container spacing={0} direction="column">
          <Typography variant="h5" className="text-center mb-0">{stat}</Typography>
          <Typography variant="body2" className="text-center">{helpText}</Typography>
        </Grid>
      </Grid>
    </Paper>
  </Grid>
)

export default StatCard
