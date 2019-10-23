import React from 'react'
import {
  CircularProgress,
  Grid,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Chart from 'chart.js'
import {
  VOLUME_CHART as volChartCfg,
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

const TopicTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    background: 'transparent',
    marginRight: 40,
    padding: 0,
    minWidth: 32,
    width: 'auto',
    minHeight: 20,
    height: 27,
    borderRadius: 7,
    color: theme.palette.subtitle,
    lineHeight: '10px',
    fontSize: 14,
    '&$selected': {
      color: theme.palette.maintitle,
      background: 'transparent',
    },
  },
  selected: {},
}))(props => <Tab disableRipple {...props} />)


const TimePeriod = {
  // _24h: '24h',
  _7d: '7d',
  _1M: '1M',
}

const Topic = {
  _volume: 'Volume',
  _fills: 'Fills',
}

export default class VolumeChart extends React.Component {

  VOLUME_CHART = undefined
  FILLS_CHART = undefined

  state = {
    period: TimePeriod._7d,
    topic: Topic._volume,
  }

  componentDidUpdate() {
    const shouldInitChart = this.props.data._7d && !this.VOLUME_CHART
    if (shouldInitChart) {
      return shouldInitChart ? this.initChart() : undefined
    }
  }

  initChart() {
    const renderChart = (chartData = [], chartId) => {

      const ctx = document.getElementById(chartId).getContext('2d')

      // NOTE: refer to http://victorblog.com/html5-canvas-gradient-creator/
      const bgFill = ctx.createLinearGradient(150.000, 200.000, 150.000, 0.000)
      bgFill.addColorStop(0.000, 'rgba(21, 12, 123, 0.400)')
      bgFill.addColorStop(1.000, 'rgba(72, 121, 217, 0.300)')

      const lineFill = ctx.createLinearGradient(150.000, 200.000, 150.000, 0.000)
      lineFill.addColorStop(0.000, 'rgba(27, 0, 109, 0.0500)')
      lineFill.addColorStop(1.000, 'rgba(0, 199, 255, 0.800)')

      const chart = new Chart(ctx, volChartCfg(chartData, bgFill, lineFill))
      return chart
    }

    this.VOLUME_CHART = renderChart(this.props.data._7d, 'volume-chart')
    // this.FILLS_CHART = renderChart(this.props.fillData || mockdata(), 'fills-chart')
  }

  changeTimePeriod = (_, periodIndex) => {
    const period = Object.values(TimePeriod)[periodIndex]
    this.setState({ period })
    const data = this.props.data[`_${period}`]
    this.VOLUME_CHART.data.labels = data.map(t => t.label)
    this.VOLUME_CHART.data.datasets[0].data = data.map(t => t.value)
    this.VOLUME_CHART.update({ duration: 0 })
  }

  changeTopic = (_, topicIndex) => this.setState({ topic: Object.values(Topic)[topicIndex] })

  render() {
    const {
      period,
      topic,
    } = this.state

    const loading = !Boolean(this.props.data._7d)

    return (
      <StyledPaper elevation={0} >
        <Grid container alignItems="center" spacing={4}>
          <Grid item sm={6} xs={4}>
            <PeriodTabs value={Object.values(Topic).indexOf(topic)} onChange={this.changeTopic}>
              <TopicTab label="Volume" />
              {/* <TopicTab label="Fills" /> */}
            </PeriodTabs>
          </Grid>
          <Grid item container justify="flex-end" sm={6} xs={8}>
            <PeriodTabs value={Object.values(TimePeriod).indexOf(period)} onChange={this.changeTimePeriod}>
              <PeriodTab label="7d" disabled={loading} />
              <PeriodTab label="1M" disabled={loading} />
            </PeriodTabs>
          </Grid>
          <Grid item sm={12} style={{ position: 'relative', height: 180 }} container justify="center" alignItems="center">
            {loading ? (
              <CircularProgress style={{ height: 50, width: 50 }} />
            ) : (
              <React.Fragment>
                <canvas
                  id="volume-chart"
                  style={{ height: '100%', width: '100%', display: topic === Topic._volume ? 'initial' : 'none' }}
                />
                <canvas
                  id="fills-chart"
                  style={{ height: '100%', width: '100%', display: topic === Topic._fills ? 'initial' : 'none' }}
                />
              </React.Fragment>
            )}
          </Grid>
        </Grid>
      </StyledPaper>
    )
  }
}
