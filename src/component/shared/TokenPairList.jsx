import React from 'react'
import { connect } from 'redux-zero/react'
import {
  Box,
  Button,
  Checkbox,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'
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
import LoadSpinner from 'component/utility/LoadSpinner'

const RefreshButton = withStyles(theme => ({
  root: {
    fontSize: 14,
    color: theme.palette.link,
    textTransform: 'none',
    padding: '0px 10px',
    '&:hover': {
      background: 'transparent',
      textDecoration: 'underline',
    },
  }
}))(props => <Button {...props} variant="text" />)

const TabControls = withStyles(theme => ({
  root: {
    height: 30,
    minHeight: 30,
  },
  indicator: {
    display: 'none',
  },
}))(Tabs)


const TokenTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    background: theme.palette.tabInactive,
    marginRight: 15,
    minWidth: 32,
    width: 60,
    minHeight: 30,
    height: 30,
    borderRadius: 10,
    color: theme.palette.body1,
    lineHeight: '10px',
    fontSize: 12,
    '&.selected': {
      color: theme.palette.maintitle,
      background: theme.palette.tabActive,
    },
  },
  selected: {},
}))(props => <Tab disableRipple {...props} />)


const SearchBar = withStyles(theme => ({
  root: {
    '& .MuiOutlinedInput-root': {
      'background': theme.palette.tabInactive,
    }
  },
}))(props => <TextField variant="outlined" fullWidth {...props} />)


const StyledCheckbox = withStyles({
  root: {
    'color': '#7473A6',
  },
})(props => (
  <Checkbox {...props} />
))

const ListHeader = withStyles(theme => ({
  root: {
    padding: '20px 5px 5px 5px',
    borderBottom: `solid 1px ${theme.palette.tabInactive}`
  }
}))(Box)

const ListBoxWrapper = withStyles(theme => ({
  root: {
    height: 500,
    overflow: 'scroll',
    paddingBottom: 10,
    position: 'relative',
  }
}))(Box)

const TokenListItem = withStyles(theme => ({
  root: {
    borderRadius: 2,
    '&:hover': {
      background: theme.palette.tabInactive + '66',
    },
  },
}))(ListItem)

const SearchOverlay = withStyles(theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    textAlign: 'center',
    zIndex: 1,
    animation: '.5s linear fadeIn',
    background: theme.palette.paper + 'F2',
    '&>img': {
      position: 'absolute',
      top: '40%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  }
}))(Box)


class TokenPairList extends React.Component {

  FILTER_CONTROLS = {
    ALL: pair => pair,
    SEARCH: str => pair => {
      if (!str || !str.length) {return true}
      const regex = new RegExp(str, 'i')
      const searchField = `${pair.toString()}${pair.from.name}${pair.to.name}`
      return regex.exec(searchField)
    }
  }

  state = {
    activeFilter: 'ALL',
    searchText: undefined,
    debounceText: '',
    isSearching: false,
  }

  componentDidMount() {
    this.props.quoteTokens.forEach(t => {
      const symbol = t.symbol
      this.FILTER_CONTROLS[symbol] = pair => pair.from.symbol === symbol || pair.to.symbol === symbol
    })
  }

  componentDidUpdate(prevProps, prevStates) {
    const {
      debounceText,
      activeFilter,
    } = this.state

    const searchActive = debounceText.length > 0 && debounceText !== prevStates.debounceText

    if (searchActive && activeFilter !== 'SEARCH') {
      this.setState({ activeFilter: 'SEARCH' })
    }

    if (searchActive) {
      this.setState({ isSearching: true })
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.debounce = undefined
        this.setState({ searchText: this.state.debounceText, isSearching: false })
      }, 1000)
    }

    if (activeFilter !== 'SEARCH' && prevStates.activeFilter === 'SEARCH') {
      clearTimeout(this.debounce)
      this.debounce = undefined
      this.setState({ searchText: undefined, debounceText: '' })
    }

  }

  debounce = undefined

  setFilter = filter => () => {
    this.setState({ activeFilter: filter === this.state.activeFilter ? 'ALL' : filter })
  }

  searchInputChange = e => this.setState({ debounceText: e.target.value })

  handleItemClick = pair => () => {
    if (this.props.disabled) {return undefined}
    const index = this.props.pairs.indexOf(pair)
    const newList = Array.from(this.props.pairs)
    newList[index].checked = !newList[index].checked
    const checkedList = newList.filter(p => p.checked)
    return this.props.onChange(checkedList)
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

    this.setState({ isSearching: true })

    const contractTokens = await TomoXContract.tokens()
    const missingTokens = contractTokens.filter(t => !inArray(t.toLowerCase(), Tokens))

    if (isEmpty(missingTokens)) {
      this.setState({ isSearching: false })
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

    this.setState({ isSearching: false })

    if (newTokens.error) {
      return this.props.PushAlert({
        variant: AlertVariant.error,
        message: newTokens.error.detail,
      })
    }

    return saveNewTokens(newTokens)
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
      searchText,
      activeFilter,
      isSearching,
    } = this.state

    const filterFunction = activeFilter !== 'SEARCH' ? this.FILTER_CONTROLS[activeFilter] : this.FILTER_CONTROLS[activeFilter](searchText)

    return (
      <Paper className="p-1" elevation={0}>
        <Grid container direction="column">
          <Grid item container justify="space-evenly" alignItems="center" spacing={3}>
            <Grid item xs={6}>
              <TabControls value={activeFilter}>
                {quoteTokens.map(token => (
                  <TokenTab
                    key={token.symbol}
                    value={token.symbol}
                    onClick={this.setFilter(token.symbol)}
                    label={token.symbol}
                    className={activeFilter === token.symbol ? 'selected' : ''}
                  />
                ))}
                <TokenTab key={'ALL'} value={'ALL'} label={'ALL'} style={{ display: 'none' }} />
                <TokenTab key={'SEARCH'} value={'SEARCH'} label={'SEARCH'} style={{ display: 'none' }} />
              </TabControls>
            </Grid>
            <Grid item xs={6}>
              <SearchBar
                name="search-input"
                type="text"
                value={this.state.debounceText}
                placeholder="Search"
                onChange={this.searchInputChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
          <ListHeader display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body2">
                Pair
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2">
                Volume 7 days ($)
              </Typography>
            </Box>
          </ListHeader>
          <ListBoxWrapper>
            {isSearching && (
              <SearchOverlay>
                <LoadSpinner />
              </SearchOverlay>
            )}
            <List dense>
              {checkList.filter(filterFunction).map(p => (
                <TokenListItem key={p.toString()} onClick={this.handleItemClick(p)} className="pl-0 pointer">
                  <ListItemIcon>
                    <StyledCheckbox
                      color={p.checked ? 'primary' : 'default'}
                      checked={p.checked}
                      disabled={disabled}
                      inputProps={{
                        'aria-label': p.toString(),
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText primary={p.toString()}/>
                </TokenListItem>
              ))}
            </List>
          </ListBoxWrapper>
          <Box display="flex" justifyContent="flex-end" alignItems="center" style={{ transform: 'translateY(9px)' }}>
            {isSearching ? (
              <Box>
                refreshing...
              </Box>
            ): (
              <React.Fragment>
                <Box>
                  <Typography variant="body2" className="m-0">
                    Not seeing your tokens?
                  </Typography>
                </Box>
                <Box>
                  <RefreshButton onClick={this.queryTokens} disabled={isSearching}>
                    Refresh now
                  </RefreshButton>
                </Box>
              </React.Fragment>
            )}
          </Box>
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
    Tokens: Tokens.map(t => t.address.toLowerCase()),
    pairs,
    pairMapping,
    quoteTokens: Tokens.filter(t => t.is_major),
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
