import React from 'react'
import cx from 'classnames'
import Creatable from 'react-select/lib/Creatable'
import { Chip, Button, IconButton } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import AddIcon from '@material-ui/icons/Add'
import { grey, red } from '@material-ui/core/colors'
import { Container, Grid } from 'component/utility'
import { MISC, STANDARD_ERC20_ABI, TRADABLE_TOKENS, Tokenizer } from 'service/constant'
import { ERC20TokenInfo } from 'service/blockchain'

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
  TokenSelect: {
    border: 'solid 1px #ddd',
    borderRadius: 2,
    width: '90px',
    select: {
      paddingLeft: 10,
    }
  }
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


export class TokenSelect extends React.Component {
  state = {
    tokens: Array.from(TRADABLE_TOKENS),
    fromToken: undefined,
    toToken: undefined,
    newlyAddedToken: '',
  }

  handleChange = token => e => {
    this.setState({ [token]: e.value })
  }

  addNewToken = type => async selectValue => {
    if (!selectValue.__isNew__) return this.handleChange(type)(selectValue)
    const tokenAddress = selectValue.value
    const tokenData = await ERC20TokenInfo(tokenAddress)

    if (!tokenData) {
      alert('Wrong token')
      return
    }
    console.log(tokenData)

    const newToken = Tokenizer(tokenData.symbol, tokenAddress)
    this.setState({ [type]: tokenData.symbol })
  }

  render() {
    const SelectOptions = (type) => this.state.tokens.filter(t => t.address !== this.state.tokens[type === 'fromToken' ? 'toToken' : 'fromToken']).map(tk => ({
      value: tk.address,
      label: tk.symbol,
    }))

    const { classes } = this.props
    return (
      <Grid className="align-center justify-space-between mt-1">
        <div className="col-12">
          <Creatable
            isClearable
            value={this.state.fromToken}
            onChange={this.addNewToken('fromToken')}
            onInputChange={this.handleChange('fromToken')}
            options={SelectOptions('fromToken')}
            placeholder="Select or paste token address"
            className="mb-1"
          />
          <Creatable
            isClearable
            value={this.state.toToken}
            onChange={this.addNewToken('toToken')}
            onInputChange={this.handleChange('toToken')}
            options={SelectOptions('toToken')}
            placeholder="Select or paste token address"
          />
        </div>
        <div>
          Add Token Pair: {this.state.fromToken} / {this.state.toToken}
        </div>
        <div className="col-4">
          <IconButton aria-label="Add">
            <AddIcon />
          </IconButton>
        </div>
      </Grid>
    )
  }
}

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
      <TokenSelect />
      {this.props.error ? (
         <div className="mt-2 text-alert">
           At least one(1) trading pairs must be selected!
         </div>
      ) : (
         <div className="mt-2">
           Your have selected <TotalPairChip label={this.state.pairs.length} /> trade pairs
         </div>
      )}
    </div>
  )
}

export const TotalPairChip = withStyles(styles)(({ label, classes }) => (
  <Chip label={label} className={classes.PairChip} />
))
