import React from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core'

const StatCard = ({
  icon,
  stat,
  helpText,
}) => (
  <Grid item xs={6} md={3}>
    <Paper elevation={0} style={{ padding: 20 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <img alt="" src={icon} height="27px" />
        <Typography variant="h6" className="mt-1">
          {stat}
        </Typography>
        <Typography variant="body2" className="text-center m-0">
          {helpText}
        </Typography>
      </Box>
    </Paper>
  </Grid>
)

export default StatCard
