import React from 'react'
import { connect } from 'redux-zero/react'
import {
  Grid,
  Paper,
} from '@material-ui/core'
import {
  getTokenInfo,
  createNewTokens,
} from 'service/backend'
import {
  AlertVariant,
  PushAlert,
} from 'service/frontend'
import {
  inArray,
  isEmpty,
} from 'service/helper'
import FilterControls from './FilterControls'
import PairList from './PairList'
import PairItem from './PairItem'
import RefreshControl from './RefreshControl'


class TokenPairList extends React.Component {

  state = {
    isRefreshing: false,
    filterFunction: p => p
  }

  makeCheckList = (pairs, pairMapping, value) => {
    const result = Array.from(pairs)
    const mappingKeys = value.from_tokens.map((from, idx) => `${from}${value.to_tokens[idx]}`)
    mappingKeys.forEach(key => {
      const pairIndex = pairMapping[key]

      if (pairIndex === undefined) {
        // TODO: check and save this token to Database then return it as normal
        console.warn(`This token ${key} is not found in Database`)
        return
      }

      result[pairIndex].checked = true
    })
    return result
  }

  queryTokens = async () => {
    const {
      saveNewTokens,
      Tokens,
      TomoXContract,
    } = this.props

    this.setState({ isRefreshing: true })

    const contractTokens = await TomoXContract.tokens()
    const missingTokens = contractTokens.filter(t => !inArray(t.toLowerCase(), Tokens))

    if (isEmpty(missingTokens)) {
      this.setState({ isRefreshing: false })
      return this.props.PushAlert({
        variant: AlertVariant.info,
        message: 'No new tokens to be added'
      })
    }

    const result = await Promise.all(missingTokens.map(getTokenInfo))
    const payload = result.map(token => ({
      address: token.hash.toLowerCase(),
      name: token.name,
      symbol: token.symbol,
      total_supply: token.totalSupply,
    }))
    const newTokens = await createNewTokens(payload)

    this.setState({ isRefreshing: false })

    if (newTokens.error) {
      return this.props.PushAlert({
        variant: AlertVariant.error,
        message: newTokens.error.detail,
      })
    }

    return saveNewTokens(newTokens)
  }

  setFilter = func => this.setState({ filterFunction: func })

  onItemChange = pair => () => {
    const index = this.props.pairs.indexOf(pair)
    const newList = Array.from(this.props.pairs)
    newList[index].checked = !newList[index].checked
    const checkedList = newList.filter(p => p.checked)
    return this.props.onChange(checkedList)
  }

  render() {
    const {
      quoteTokens,
      pairs,
      pairMapping,
      value,
      disabled,
    } = this.props

    const checkList = this.makeCheckList(pairs, pairMapping, value)
    const {
      filterFunction,
      isRefreshing,
    } = this.state

    return (
      <Paper elevation={0}>
        <Grid container direction="column">
          {!disabled && <FilterControls onChange={this.setFilter} quoteTokens={quoteTokens} />}
          <PairList>
            {checkList.filter(filterFunction).map(p => (
              <PairItem
                key={p.toAddrString()}
                pair={p}
                disabled={disabled}
                onChange={this.onItemChange}
              />
            ))}
          </PairList>
          {!disabled && <RefreshControl onRefresh={this.queryTokens} disabled={isRefreshing} />}
        </Grid>
      </Paper>
    )
  }
}

export const mapProps = state => {
  // NOTE: this paring funcion will be quite expensive if the number of tokens is big enough
  // Must consider memoization by then
  const Tokens = state.Tokens

  const pairs = []

  // NOTE: due to concern over the excessive size of token-pairs array each relayer may has,
  // we keep a special Object called `pairMapping` utilizing `fromAddress/toAddress` as key
  // and `index` of the pair in array pair - for faster query/retrieve data
  // the object, being memoized as well, should be saved in the store for referrence
  const pairMapping = {}

  Tokens.forEach((fromToken, fromIdx) => {
    Tokens.filter((toToken, toIdx) => {
      if (fromIdx === toIdx) {return false}
      if (toToken.is_major) {return true}
      if (!fromToken.is_major) {return true}
      return false
    }).forEach((toToken, toIdx) => pairs.push({
      from: fromToken,
      to: toToken,
      toString: () => `${fromToken.symbol}/${toToken.symbol}`,
      checked: false,
      toAddrString: () => `${fromToken.address}-${toToken.address}`,
    }))
  })

  pairs.sort((a, b) => {
    if (a.from.symbol === b.from.symbol) {return 1 * a.to.symbol.localeCompare(b.to.symbol)}
    if (a.from.symbol === 'TOMO') {return -1}
    if (a.from.is_major && b.from.is_major) {return 1 * a.from.symbol.localeCompare(b.from.symbol)}
    return 1 * a.from.symbol.localeCompare(b.from.symbol)
  })

  pairs.forEach((p, idx) => {
    pairMapping[`${p.from.address}${p.to.address}`] = idx
  })

  return {
    pairs,
    pairMapping,
    quoteTokens: Tokens.filter(t => t.is_major),
    Tokens: Tokens.map(t => t.address.toLowerCase()),
    TomoXContract: state.blk.TomoXContract,
  }
}

const actions = store => ({
  saveNewTokens: (state, tokens) => ({
    Tokens: [
      ...state.Tokens,
      ...tokens,
    ]
  }),
  PushAlert,
})

const storeConnect = connect(mapProps, actions)

export default storeConnect(TokenPairList)
