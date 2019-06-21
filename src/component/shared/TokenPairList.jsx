import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import {
  Badge,
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
import MajorTokenFilter, { MajorTokenSelect } from './MajorTokenFilter'


export class TokenPairList extends React.Component {
  static defaultProps = {
    // If we need to extract an array of whole Token-Object, change this prop to false
    addressOnly: true,
  }

  state = {
    selected: [],
    filters: [],
  }

  componentDidMount() {
    const { fromTokens, toTokens, pairs } = this.props
    if (!fromTokens || !fromTokens.length) return
    const selected = fromTokens.map((addr, idx) => pairs.find(p => p.from.address === addr && p.to.address === toTokens[idx]))
    this.setState({ selected })
  }

  applyFilters = pairs => {
    const filters = this.state.filters
    const filterKeys = Object.keys(filters)
    if (filterKeys.length === 0) return pairs
    const reduceFunc = (filteredPairs, key) => filteredPairs.filter(filters[key])
    return filterKeys.reduce(reduceFunc, pairs)
  }

  pickPair = (pair, selected) => () => {
    if (this.props.disabled) return
    const index = selected.indexOf(pair)
    index >= 0 ? selected.splice(index, 1) : selected.push(pair)
    this.setState({ selected }, this.dispatchChange)
  }

  selectAll = (pairs, selected, checked) => () => {
    pairs.forEach(p => {
      const index = selected.indexOf(p)
      checked && index >= 0 && selected.splice(index, 1)
      !checked && index < 0 && selected.push(p)
    })
    this.setState({ selected }, this.dispatchChange)
  }

  isAllChecked = (pairs, selected) => pairs.reduce((acc, p) => acc && selected.includes(p), true)

  setFilters = {
    tokens: tokens => {
      const filters = { ...this.state.filters }
      const filterByMajorTokens = pair => tokens.includes(pair.from.address) || tokens.includes(pair.to.address)
      const fallbackFilter = pair => pair
      filters.filterByMajorTokens = tokens.length > 0 ? filterByMajorTokens : fallbackFilter
      this.setState({ filters })
    }
  }

  dispatchChange = () => {
    const { addressOnly, onChange } = this.props
    const selected = this.state.selected
    onChange('from_tokens', selected.map(p => addressOnly ? p.from.address : p.from))
    onChange('to_tokens', selected.map(p => addressOnly ? p.to.address : p.to))
  }

  render() {
    const { pairs, majorTokens, disabled } = this.props
    const { selected: selectedPairs } = this.state
    const filteredPairs = this.applyFilters(pairs)
    const isAllChecked = this.isAllChecked(filteredPairs, selectedPairs)
    const selectAllBtnText = `${isAllChecked ? 'Unselect' : 'Select'} ${filteredPairs.length} pairs`

    return (
      <Box border={1}>
        <Box display="flex" justifyContent="space-between" className="p-1 pr-2 pl-2" alignItems="center" borderBottom={1}>
          {!disabled && (
            <Badge color="primary" badgeContent={`${selectedPairs.length}`}>
              <MajorTokenSelect
                name={selectAllBtnText}
                onClick={this.selectAll(filteredPairs, selectedPairs, isAllChecked)}
                selected={isAllChecked}
              />
            </Badge>
          )}
          <MajorTokenFilter
            majorTokens={majorTokens}
            setFilter={this.setFilters.tokens}
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
        <Box>

        </Box>
        <List dense className="bg-filled token-list token-list__limited-height">
          {filteredPairs.map((p, idx) => (
            <ListItem key={p.toString()} className="pr-1 pl-1 pointer pair-item" onClick={this.pickPair(p, selectedPairs)}>
              <ListItemIcon>
                <Checkbox color="default" checked={selectedPairs.includes(p)} disabled={disabled} />
              </ListItemIcon>
              <ListItemText primary={p.toString()} />
            </ListItem>
          ))}
        </List>
      </Box>
    )
  }
}

export const mapProps = state => {
  // NOTE: this paring funcion will be quite expensive if the number of tokens is big enough
  // Must consider memoization by then
  const tradeTokens = state.tradableTokens

  const pairs = []

  tradeTokens.forEach((fromToken, fromIdx) => {
    tradeTokens.filter((toToken, toIdx) => {
      if (fromIdx === toIdx) return false
      if (toToken.is_major) return true
      if (!fromToken.is_major) return true
      return false
    }).forEach((toToken, toIdx) => pairs.push({
      from: fromToken,
      to: toToken,
      toString: () => `${fromToken.symbol}/${toToken.symbol}`
    }))
  })

  pairs.sort((a, b) => {
    if (a.from.symbol === b.from.symbol) return 1 * a.to.symbol.localeCompare(b.to.symbol)
    if (a.from.symbol === 'TOMO') return -1
    if (b.from.symbol === 'TOMO') return 1
    if (a.from.is_major && b.from.is_major) return 1 * a.from.symbol.localeCompare(b.from.symbol)
    return 1 * a.from.symbol.localeCompare(b.from.symbol)
  })

  return { pairs, majorTokens: state.MajorTokens }
}

const storeConnect = connect(mapProps)

export default storeConnect(TokenPairList)
