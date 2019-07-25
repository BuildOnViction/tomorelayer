import React from 'react'
import {
  Grid,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Chart from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import {
  TOKEN_CHART as tokChartCfg,
} from './charts.config'

const StyledPaper = withStyles(theme => ({
  root: {
    padding: '1.4em 2.2em',
  }
}))(Paper)

const PeriodTabs = withStyles(theme => ({
  root: {
    minHeight: 30,
  },
  indicator: {
    display: 'none',
  },
}))(Tabs)

const PeriodTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    background: theme.palette.tabInactive,
    marginLeft: 10,
    minWidth: 32,
    width: 50,
    minHeight: 20,
    height: 27,
    borderRadius: 7,
    color: theme.palette.subtitle,
    lineHeight: '10px',
    fontSize: 12,
    '&$selected': {
      color: theme.palette.maintitle,
      background: theme.palette.tabActive,
    },
  },
  selected: {},
}))(props => <Tab disableRipple {...props} />)


const TimePeriod = {
  _24h: '24h',
  _7d: '7d',
  _1M: '1M',
}

export default class TokenChart extends React.Component {

  TOKEN_CHART = undefined

  state = {
    period: TimePeriod._24h,
  }

  componentDidMount() {
    const mockdata = [
      { label: 'GNBA', value: 8 },
      { label: 'BNB', value: 22 },
      { label: 'TRIIP', value: 61 },
      { label: 'ETH', value: 2 },
      { label: 'BTC', value: 1 },
    ].sort((a, b) => a.value > b.value ? -1 : 1)

    const ctx = document.getElementById('token-chart').getContext('2d')

    let grd

    // NOTE: refer to http://victorblog.com/html5-canvas-gradient-creator/
    grd = ctx.createLinearGradient(0.000, 150.000, 300.000, 150.000)

    // Add colors
    grd.addColorStop(0.000, 'rgba(1, 30, 173, 1.000)')
    grd.addColorStop(1.000, 'rgba(94, 166, 255, 1.000)')

    // Fill with gradient
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, 300.000, 300.000)
    this.TOKEN_CHART = new Chart(ctx, tokChartCfg(mockdata, grd, ChartDataLabels))
  }

  changeTimePeriod = (_, periodIndex) => this.setState({ period: Object.values(TimePeriod)[periodIndex] })

  render() {
    const {
      period,
    } = this.state
    return (
      <StyledPaper elevation={0} >
        <Grid container alignItems="center" spacing={2}>
          <Grid item sm={6}>
            Top Tokens
          </Grid>
          <Grid item container justify="flex-end" sm={6}>
            <PeriodTabs value={Object.values(TimePeriod).indexOf(period)} onChange={this.changeTimePeriod}>
              <PeriodTab label="24h" />
              <PeriodTab label="7d" />
              <PeriodTab label="1M" />
            </PeriodTabs>
          </Grid>
          <Grid item sm={12} style={{ height: 160 }}>
            <canvas id="token-chart" style={{ height: '100%', width: '100%' }} />
          </Grid>
        </Grid>
      </StyledPaper>
    )
  }
}
