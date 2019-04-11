import React from 'react'
import cx from 'classnames'
import { Chip, Button } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { grey, red } from '@material-ui/core/colors'
import { MISC } from 'service/constant'

const AVAILABLE_TRADE_PAIRS = MISC.AvailableTradePairs

const styles = theme => ({
  SubtleButton: {
    fontSize: '0.7rem',
    borderRadius: 50,
    color: grey[500],
    '&:hover': {
      color: grey[500],
    },
  },
  ActiveButton: {
    fontSize: '0.7rem',
    borderRadius: 50,
    background: red[50],
    color: red[500],
    '&:hover': {
      background: 'none',
    },
  },
  PairChip: {
    height: 22,
    margin: '0 5px',
    '&> span': {
      padding: 8,
    },
  },
})

export const TradePairChoice = withStyles(styles)(({ text, selected, classes, onClick }) => {
  const cls = cx('mr-1', {
    [classes.SubtleButton]: !selected,
    [classes.ActiveButton]: selected,
  })
  return (
    <Button className={cls} type="button" size="small" onClick={onClick}>
      {text}
    </Button>
  )
})

export class TradePairSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pairs: props.value
    }
    this.inputRef = React.createRef()
  }

  componentDidMount() {
    this.inputRef.current.addEventListener('input', this.handleChange)
  }

  updatePairs = pair => () => {
    const pairs = Array.from(this.state.pairs)
    if (pairs.includes(pair)) {
      const index = pairs.indexOf(pair)
      pairs.splice(index, 1)
    } else {
      pairs.push(pair)
    }
    this.setState({ pairs }, () => {
      const event = new Event('input', { bubbles: true })
      const node = this.inputRef.current
      node.dispatchEvent(event)
    })
  }

  handleChange = e => {
    this.props.onChange(e)
  }

  componentWillUnmount() {
    this.inputRef.current.removeEventListener('input', this.handleChange)
  }

  render = () => (
    <div>
      <input
        name={this.props.name}
        type="text"
        value={this.state.pairs}
        onChange={this.handleChange}
        ref={this.inputRef}
        hidden
      />
      {AVAILABLE_TRADE_PAIRS.map(pair => (
        <TradePairChoice
          text={pair}
          selected={this.state.pairs.includes(pair)}
          onClick={this.updatePairs(pair)}
          key={pair}
        />
      ))}
      <div className="mt-2">
        Your have selected <TotalPairChip label={this.state.pairs.length} /> trade pairs
      </div>
    </div>
  )
}

export const TotalPairChip = withStyles(styles)(({ label, classes }) => (
  <Chip label={label} className={classes.PairChip} />
))
