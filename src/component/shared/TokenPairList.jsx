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


export const FilterControl = ({ onFilterChange }) => (
  <Box display="flex" justifyContent="space-between" className="p-1 pr-2 pl-2" alignItems="center" borderBottom={1}>

  </Box>
)

const handleClickPair = (pairs, index) => {
  // Each action should return a new `checkList`
  const items = Array.from(pairs)
  const pair = items[index]

  if (pair.checked) {
    delete pair['checked']
  } else {
    pair.checked = true
  }
  return items
}

export const PairList = ({ items, onCheck }) => {
  const onClick = (items, idx) => () => onCheck(handleClickPair(items, idx))
  const ariaLabel = pair => `${pair.toString().toLowerCase()}-input`
  return (
    <List dense className="bg-filled token-list token-list__limited-height">
      {items.map((p, idx) => (
        <ListItem key={p.toString()} className="pr-1 pl-1 pointer pair-item" onClick={onClick(items, idx)}>
          <ListItemIcon>
            <Checkbox
              color="default"
              checked={Boolean(p.checked)}
              inputProps={{ 'aria-labelledby': ariaLabel(p) }}
            />
          </ListItemIcon>
          <ListItemText primary={p.toString()} id={ariaLabel(p)} />
        </ListItem>
      ))}
    </List>
  )
}

export const makeCheckList = (fromTokens, toTokens, pairs, pairMapping) => {
  const checkedPairs = Array.from(pairs)
  fromTokens.forEach((tokenAddress, idx) => {
    const key = `${tokenAddress}${toTokens[idx]}`
    const pairIndex = pairMapping[key]
    checkedPairs[pairIndex]['checked'] = true
  })
  return checkedPairs
}

export const TokenPairList = ({
  fromTokens,
  toTokens,
  onChange,
  pairs,
  pairMapping,
}) => {

  const items = makeCheckList(fromTokens, toTokens, pairs, pairMapping)
  const onCheck = newItems => console.log(newItems)
  return (
    <Box border={1}>
      <PairList items={items} onCheck={onCheck} />
    </Box>
  )
}

export const mapProps = state => {
  // NOTE: this paring funcion will be quite expensive if the number of tokens is big enough
  // Must consider memoization by then
  const tradeTokens = state.tradableTokens

  const pairs = []

  // NOTE: due to concern over the excessive size of token-pairs array each relayer may has,
  // we keep a special Object called `pairMapping` utilizing `fromAddress/toAddress` as key
  // and `index` of the pair in array pair - for faster query/retrieve data
  // the object, being memoized as well, should be saved in the store for referrence
  const pairMapping = {}

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

  pairs.forEach((p, idx) => {
    pairMapping[`${p.from.address}${p.to.address}`] = idx
  })

  return { pairs, pairMapping }
}

const storeConnect = connect(mapProps)

export default storeConnect(TokenPairList)
