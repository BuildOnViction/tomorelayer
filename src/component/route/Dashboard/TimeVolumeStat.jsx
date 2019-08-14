import React from 'react'
import {
  Grid,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import Chart from 'chart.js'
import { IS_DEV } from 'service/constant'
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
    const mockdata = new Array(80).fill().map((_, idx) => ({
      label: idx % 5 === 0 ? 'abc' : '',
      value: Math.random() * 2500 + 500,
    }))

    const ctx = document.getElementById('volume-chart').getContext('2d')

    // NOTE: refer to http://victorblog.com/html5-canvas-gradient-creator/
    const bgFill = ctx.createLinearGradient(150.000, 200.000, 150.000, 0.000)
    bgFill.addColorStop(0.000, 'rgba(21, 12, 123, 0.400)')
    bgFill.addColorStop(1.000, 'rgba(72, 121, 217, 0.300)')

    const lineFill = ctx.createLinearGradient(150.000, 200.000, 150.000, 0.000)
    lineFill.addColorStop(0.000, 'rgba(27, 0, 109, 0.0500)')
    lineFill.addColorStop(1.000, 'rgba(0, 199, 255, 0.800)')

    const chartData = IS_DEV ? mockdata : this.props.data

    this.VOLUME_CHART = new Chart(ctx, volChartCfg(chartData, bgFill, lineFill))
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
          <Grid item sm={12} style={{ position: 'relative', height: 282 }}>
            <canvas id="volume-chart" style={{ height: '100%', width: '100%' }} />
          </Grid>
        </Grid>
      </StyledPaper>
    )
  }
}

TimeVolumeStat.defaultProps = {
  data: [],
}
