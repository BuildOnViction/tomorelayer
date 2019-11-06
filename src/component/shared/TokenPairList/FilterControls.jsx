import React from 'react'
import {
  CircularProgress,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import SearchIcon from '@material-ui/icons/Search'

const Spinner = withStyles({
  root: {
    width: '17px !important',
    height: '17px !important',
  }
})(CircularProgress)

const FilterControlContainer = withStyles({
  root: {
    padding: '1em',
    paddingBottom: 0,
  }
})(Grid)

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
    },
    '& .MuiOutlinedInput-adornedEnd': {
      paddingRight: 10,
    },
  },
}))(props => <TextField variant="outlined" fullWidth {...props} />)


export default class FilterControls extends React.Component {
  /*
   * @input: quote_tokens
   * @output: filter_function
  */

  FILTER_CONTROLS = {
    ALL: pair => pair,
    SEARCH: str => pair => {
      if (!str || !str.length) {return true}
      const regex = new RegExp(str, 'i')
      const searchField = `${pair.from.symbol}/${pair.to.symbol}`
      return !!regex.exec(searchField)
    }
  }

  debounce = undefined

  state = {
    activeFilter: 'ALL',
    searchText: undefined,
    debounceText: '',
    isSearching: false,
  }

  componentDidMount() {
    this.props.quoteTokens.forEach(t => {
      const symbol = t.symbol
      this.FILTER_CONTROLS[symbol] = pair => pair.to.symbol === symbol
    })
  }

  setFilter = () => {
    const { activeFilter, searchText } = this.state
    const { onChange } = this.props
    const toBeUsedFilter = activeFilter !== 'SEARCH' ? this.FILTER_CONTROLS[activeFilter] : this.FILTER_CONTROLS[activeFilter](searchText)
    onChange(toBeUsedFilter)
  }

  onTokenTabClick = symbol => () => {
    const { activeFilter } = this.state
    this.setState({
      activeFilter: activeFilter === symbol ? 'ALL' : symbol,
      debounceText: '',
      searchText: '',
      isSearching: false
    }, this.setFilter)
  }

  searchInputChange = e => {
    e.persist()
    const searchValue = e.target.value
    const validSearchValue = e.target.value && e.target.value.length

    this.setState({
      debounceText: searchValue,
      activeFilter: validSearchValue ? 'SEARCH' : 'ALL',
      isSearching: validSearchValue,
    }, _ => {
      clearTimeout(this.debounce)

      if (!validSearchValue) {
        this.setFilter()
        return undefined
      }
  
      this.debounce = setTimeout(() => this.setState({
        searchText: this.state.debounceText,
        isSearching: false,
      }, this.setFilter), 1000)
    })
  }

  render() {
    const {
      quoteTokens,
    } = this.props

    const {
      activeFilter,
      debounceText,
      isSearching,
    } = this.state

    const searchIconStyle = { width: 17, height: 17, opacity: .3 }

    return (
      <FilterControlContainer item container justify="space-evenly" alignItems="center" spacing={3} className="pt-1 pr-1 pl-1">
        <Grid item xs={7}>
          <TabControls value={activeFilter}>
            <TokenTab
              key={'ALL'}
              value={'ALL'}
              label={'ALL'}
              onClick={this.onTokenTabClick('ALL')}
              className={activeFilter === 'ALL' ? 'selected' : ''}
            />
            {quoteTokens.map(token => (
              <TokenTab
                key={token.symbol}
                value={token.symbol}
                onClick={this.onTokenTabClick(token.symbol)}
                label={token.symbol}
                className={activeFilter === token.symbol ? 'selected' : ''}
              />
            ))}
            <TokenTab key={'SEARCH'} value={'SEARCH'} label={'SEARCH'} style={{ display: 'none' }} />
          </TabControls>
        </Grid>
        <Grid item xs={5}>
          <SearchBar
            name="search-input"
            type="text"
            value={debounceText}
            placeholder="Search"
            onChange={this.searchInputChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isSearching ? <Spinner style={searchIconStyle} /> : <SearchIcon style={searchIconStyle} />}
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </FilterControlContainer>
    )
  }
}
