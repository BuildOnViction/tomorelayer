import React from 'react'
import {
  Box,
  Paper,
  Typography,
} from '@material-ui/core'

const StatCard = ({
  icon,
  stat,
  helpText,
}) => (
  <Paper elevation={0} className="">
    <Box display="flex" flexDirection="column" style={{ padding: 5 }}>
      <Box display="flex" justifyContent="center" alignItems="center" className="m-1">
        <img alt="" src={icon} height="100%" className="mr-1" />
        <Typography variant="subtitle1" className="m-0">{stat}</Typography>
      </Box>
      <Typography variant="body2" className="text-center">{helpText}</Typography>
    </Box>
  </Paper>
)

export default StatCard
