import React from 'react'
import cx from 'classnames'
import { Box, Grid, Paper, Typography } from '@material-ui/core'
import networkFeeIcon from 'asset/icon-network-fees.png'
import networkVolIcon from 'asset/icon-network-volume.png'
import tradeIcon from 'asset/icon-trades.png'
import tomoPriceIcon from 'asset/icon-tomo-price.png'

class StatCard extends React.Component {
  STYLE_INTERVAL = undefined

  state = {
    hightlight: false,
  }

  componentDidUpdate(prevProps) {
    if (prevProps.stat !== this.props.stat) {
      this.setState({ hightlight: true })
      this.STYLE_INTERVAL = setTimeout(() => {
        this.setState({ hightlight: false })
        clearInterval(this.STYLE_INTERVAL)
      }, 1000)
    }
  }

  componentWillUnmount() {
    if (this.STYLE_INTERVAL) {
      clearInterval(this.STYLE_INTERVAL)
    }
  }

  render() {
    const {
      hightlight
    } = this.state

    const {
      icon,
      stat,
      helpText,
    } = this.props

    const cls = cx('mt-1', {'stat-hightlight': hightlight })

    return (
      <Grid item xs={6} md={3}>
        <Paper elevation={0} style={{ padding: 20 }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <img alt="" src={icon} height="27px" />
            <Typography variant="h6" className={cls}>
              {stat}
            </Typography>
            <Typography variant="body2" className="text-center m-0">
              {helpText}
            </Typography>
          </Box>
        </Paper>
      </Grid>
    )
  }
}

const BlockStat = ({ data }) => (
  <Grid item container spacing={4}>
    <StatCard icon={networkVolIcon} stat={data.volume24h} helpText="Relayer Volume 24h" />
    <StatCard icon={networkFeeIcon} stat={data.totalFee} helpText="Relayer Fee 24h" />
    <StatCard icon={tradeIcon} stat={data.tradeNumber} helpText="Trades(24h)" />
    <StatCard icon={tomoPriceIcon} stat={data.tomoprice} helpText="Tomo Price" />
  </Grid>
)

BlockStat.defaultProps = {
  data: {
    volume24h: 0,
    totalFee: 0,
    tradeNumber: 0,
    tomoprice: 0,
  }
}

export default BlockStat
