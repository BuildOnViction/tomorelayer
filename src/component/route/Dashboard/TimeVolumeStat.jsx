import React from 'react'
import {
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
  _24h: '24h',
  _7d: '7d',
  _1M: '1M',
}

const Topic = {
  _volume: 'Volume',
  _fills: 'Fills',
}

export default class TimeVolumeStat extends React.Component {

  VOLUME_CHART = undefined
  FILLS_CHART = undefined

  state = {
    period: TimePeriod._24h,
    topic: Topic._volume,
  }

  componentDidMount() {
    const mockdata = [
      { label: 'abc', value: 1000 },
      { label: 'abc', value: 400 },
      { label: 'abc', value: 1900 },
      { label: 'abc', value: 1200 },
      { label: 'abc', value: 323 },
      { label: 'abc', value: 1250 },
      { label: 'abc', value: 2799 },
    ]

    const ctx = document.getElementById('volume-chart').getContext('2d')

    // NOTE: refer to http://victorblog.com/html5-canvas-gradient-creator/
    const grd = ctx.createLinearGradient(174.000, 300.000, 126.000, 0.200)

    // Add colors
    grd.addColorStop(0.000, 'rgba(24, 16, 58, 0.200)')
    grd.addColorStop(1.000, 'rgba(0, 22, 135, 0.200)')

    // Fill with gradient
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, 300.000, 300.000)
    this.VOLUME_CHART = new Chart(ctx, volChartCfg(mockdata, grd))
  }

  changeTimePeriod = (_, periodIndex) => this.setState({ period: Object.values(TimePeriod)[periodIndex] })

  changeTopic = (_, topicIndex) => this.setState({ topic: Object.values(Topic)[topicIndex] })

  render() {
    const {
      period,
      topic,
    } = this.state
    return (
      <StyledPaper elevation={0} >
        <Grid container alignItems="center" spacing={4}>
          <Grid item sm={6}>
            <PeriodTabs value={Object.values(Topic).indexOf(topic)} onChange={this.changeTopic}>
              <TopicTab label="Volume" />
              <TopicTab label="Fills" />
            </PeriodTabs>
          </Grid>
          <Grid item container justify="flex-end" sm={6}>
            <PeriodTabs value={Object.values(TimePeriod).indexOf(period)} onChange={this.changeTimePeriod}>
              <PeriodTab label="24h" />
              <PeriodTab label="7d" />
              <PeriodTab label="1M" />
            </PeriodTabs>
          </Grid>
          <Grid item sm={12} style={{ height: 282 }}>
            <canvas id="volume-chart" style={{ height: '100%', width: '100%' }} />
          </Grid>
        </Grid>
      </StyledPaper>
    )
  }
}
