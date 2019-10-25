import React from 'react'
import {
  CircularProgress,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Chart from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { isEmpty } from 'service/helper'
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
    const data = this.props.data
    if (data && data._24h && data._24h.some(t => t.value > 0)) {
      this.initChart()
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.TOKEN_CHART && prevProps.data !== this.props.data) {
      const dataNotAllZero = this.props.data._24h.some(t => t.value > 0)
      return dataNotAllZero ? this.initChart() : undefined
    }

    if (this.props.data._24h && this.TOKEN_CHART) {
      const period = `_${this.state.period}`
      const data = this.props.data[period]
      const dataNotAllZero = data.some(t => t.value > 0)
      return dataNotAllZero ? this.updateChart(data.slice(0, 6)) : undefined
    }
  }

  initChart() {
    const data = this.props.data
    const period = `_${this.state.period}`
    const ctx = document.getElementById('token-chart').getContext('2d')
    // NOTE: refer to http://victorblog.com/html5-canvas-gradient-creator/
    const grd = ctx.createLinearGradient(0.000, 150.000, 300.000, 150.000)
    grd.addColorStop(0.000, 'rgba(1, 30, 173, 1.000)')
    grd.addColorStop(1.000, 'rgba(94, 206, 245, 1.000)')
    const config = tokChartCfg(data[period].slice(0, 6), grd, ChartDataLabels)
    this.TOKEN_CHART = new Chart(ctx, config)
  }

  updateChart(data) {
    this.TOKEN_CHART.data.labels = data.map(t => t.label)
    this.TOKEN_CHART.data.datasets[0].data = data.map(t => t.value)
    this.TOKEN_CHART.update({ duration: 0 })
  }

  changeTimePeriod = (_, periodIndex) => this.setState({ period: Object.values(TimePeriod)[periodIndex] })

  render() {

    const {
      period,
    } = this.state

    const {
      data,
    } = this.props

    const allZeroData = data && data._24h && data._24h.every(t => t.value === 0)

    return (
      <StyledPaper elevation={0} >
        <Grid container alignItems="center" spacing={2}>
          <Grid item sm={6} xs={4}>
            Top Tokens
          </Grid>
          <Grid item container justify="flex-end" sm={6} xs={8}>
            <PeriodTabs value={Object.values(TimePeriod).indexOf(period)} onChange={this.changeTimePeriod}>
              <PeriodTab label="24h" />
              <PeriodTab label="7d" />
              <PeriodTab label="1M" />
            </PeriodTabs>
          </Grid>
          <Grid item sm={12} style={{ height: 180 }} container justify="center" alignItems="center">
            {isEmpty(data) && <CircularProgress style={{ height: 50, width: 50 }} />}
            {allZeroData && <Typography variant="body2">No trade yet</Typography>}
            <canvas id="token-chart" style={{ height: '100%', width: '100%', display: allZeroData ? 'none' : 'initial' }} />
          </Grid>
        </Grid>
      </StyledPaper>
    )
  }
}
