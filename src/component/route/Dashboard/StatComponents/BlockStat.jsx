import React from 'react'
import { Box, Grid, Paper, Typography } from '@material-ui/core'
import networkFeeIcon from 'asset/icon-network-fees.png'
import networkVolIcon from 'asset/icon-network-volume.png'
import tradeIcon from 'asset/icon-trades.png'
import tomoPriceIcon from 'asset/icon-tomo-price.png'

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

const BlockStat = ({ data }) => (
  <Grid item container spacing={4}>
    <StatCard icon={networkVolIcon} stat={`$ ${data.volume}`} helpText="Relayer Volume 24h" />
    <StatCard icon={networkFeeIcon} stat={`${data.fee} TOMO`} helpText="Relayer Fee 24h" />
    <StatCard icon={tradeIcon} stat={data.trades} helpText="Trades(24h)" />
    <StatCard icon={tomoPriceIcon} stat={`$ ${data.tomoprice}`} helpText="Tomo Price" />
  </Grid>
)

BlockStat.defaultProps = {
  data: {
    volume: 0,
    fee: 0,
    trades: 0,
    tomoprice: 0,
  }
}

export default BlockStat
