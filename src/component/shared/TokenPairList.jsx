import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import {
  Box,
  Checkbox,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import MajorTokenFilter from './MajorTokenFilter'


class TokenPairList extends React.Component {
  static defaultProps = {
    // If we need to extract an array of whole Token-Object, change this prop to false
    addressOnly: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      selected: [],
      filters: [],
    }
  }

  componentDidMount() {
    const { fromTokens, toTokens, pairs } = this.props
    if (fromTokens && toTokens) {
      const selected = fromTokens.map((addr, idx) => pairs.find(p => p.from.address === addr && p.to.address === toTokens[idx]))
      this.setState({ selected })
    }
  }

  filterToken = pairs => {
    const filters = this.state.filters
    const filterKeys = Object.keys(filters)
    if (filterKeys.length === 0) return pairs
    const reduceFunc = (filteredPairs, key) => filteredPairs.filter(filters[key])
    return filterKeys.reduce(reduceFunc, pairs)
  }

  pickPair = pair => () => {
    const selected = Array.from(this.state.selected)
    const index = selected.indexOf(pair)
    index >= 0 ? selected.splice(index, 1) : selected.push(pair)
    this.setState({ selected }, this.dispatchChange)
  }

  selectAll = pairs => () => {
    let selected = Array.from(this.state.selected)
    const checked = pairs.reduce((acc, p) => acc && selected.includes(p), true)

    pairs.forEach(p => {
      const index = selected.indexOf(p)
      checked && index >= 0 && selected.splice(index, 1)
      !checked && index < 0 && selected.push(p)
    })

    this.setState({ selected }, this.dispatchChange)
  }

  isAllChecked = pairs => {
    const selected = this.state.selected
    const checked = pairs.reduce((acc, p) => acc && selected.includes(p), true)
    return checked
  }

  listFilterByMajorTokens = tokens => {
    const filters = { ...this.state.filters }
    const filterByMajorTokens = pair => tokens.includes(pair.from.address)
    const fallbackFilter = pair => pair
    filters.filterByMajorTokens = tokens.length > 0 ? filterByMajorTokens : fallbackFilter
    this.setState({ filters })
  }

  dispatchChange = () => {
    const { addressOnly, onChange } = this.props
    const selected = this.state.selected
    onChange('from_tokens', selected.map(p => addressOnly ? p.from.address : p.from))
    onChange('to_tokens', selected.map(p => addressOnly ? p.to.address : p.to))
  }

  render() {
    const {
      pairs,
      majorTokens,
    } = this.props

    const filteredPairs = this.filterToken(pairs)

    const {
      selected: selectedPairs,
    } = this.state

    return (
      <Box border={1}>
        <Box display="flex" justifyContent="space-between" className="p-1 pr-2 pl-2" alignItems="center" borderBottom={1}>
          <MajorTokenFilter
            majorTokens={majorTokens}
            setFilter={this.listFilterByMajorTokens}
          />
          <TextField
            label="Search"
            type="text"
            variant="outlined"
            margin="dense"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <List dense className="bg-filled token-list">
          <ListItem className="pr-1 pl-1 pointer pair-item" onClick={this.selectAll(filteredPairs)}>
            <ListItemIcon>
              <Checkbox color="default" checked={this.isAllChecked(filteredPairs)} />
            </ListItemIcon>
            <ListItemText primary={`Select All (${filteredPairs.length}) pairs`} />
          </ListItem>
          {filteredPairs.map((p, idx) => (
            <ListItem key={p.toString()} className="pr-1 pl-1 pointer pair-item" onClick={this.pickPair(p)}>
              <ListItemIcon>
                <Checkbox color="default" checked={selectedPairs.includes(p)} />
              </ListItemIcon>
              <ListItemText primary={p.toString()} />
            </ListItem>
          ))}
        </List>
      </Box>
    )
  }
}

const mapProps = state => {
  const tradeTokens = state.tradableTokens
  const match = fromToken => tradeTokens.filter(t => t.id !== fromToken.id).map(toToken => ({
    from: fromToken,
    to: toToken,
    toString: () => `${fromToken.symbol}/${toToken.symbol}`
  }))
  const pairs = []
  tradeTokens.forEach(t => {
    const list = match(t)
    list.forEach(pair => pairs.push(pair))
  })

  return { pairs, majorTokens: state.MajorTokens }
}

const storeConnect = connect(mapProps)

export default storeConnect(TokenPairList)
