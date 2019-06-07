import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import {
  Box,
  Button,
  Checkbox,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

const MajorTokenSelect = ({ name, id, selected }) => (
  <Button size="small" disableRipple color={selected ? 'primary' : 'default'}>
    {name}
  </Button>
)

class TokenPairList extends React.Component {
  state = {
    selected: [],
    indexes: [],
  }

  pickPair = (p, idx) => () => {
    const state = { ...this.state }
    if (!state.indexes.includes(idx)) {
      state.selected.push(p)
      state.indexes.push(idx)
    } else {
      let position = state.indexes.indexOf(idx)
      state.indexes.splice(position, 1)
      position = state.selected.find(pair => pair.from.id === p.from.id && pair.to.id === p.to.id)
      state.selected.splice(position, 1)
    }

    this.setState(state)
  }

  selectAll = () => {
    const length = this.props.pairs.length
    if (this.state.selected.length === length) {
      this.setState({
        selected: [],
        indexes: [],
      })
    } else {
      const indexes = Array.apply(null, { length }).map(Number.call, Number)
      this.setState({ selected: this.props.pairs, indexes })
    }
  }

  render() {
    const {
      pairs,
    } = this.props

    return (
      <Box border={1}>
        <Box display="flex" justifyContent="space-around" className="p-1" alignItems="center" borderBottom={1}>
          <MajorTokenSelect name="TOMO" id={1} selected />
          <MajorTokenSelect name="USDT" id={2} />
          <MajorTokenSelect name="MAS" id={2} />
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
          <ListItem className="pr-1 pl-1 pointer pair-item" onClick={this.selectAll}>
            <ListItemIcon>
              <Checkbox
                color="default"
                tabIndex={-1}
                disableRipple
              />
            </ListItemIcon>
            <ListItemText primary="Select All" />
          </ListItem>
          {pairs.map((p, idx) =>
            <ListItem key={`${p.from.id}-${p.to.id}`} className="pr-1 pl-1 pointer pair-item" onClick={this.pickPair(p, idx)}>
              <ListItemIcon>
                <Checkbox
                  color="default"
                  tabIndex={-1}
                  checked={this.state.indexes.includes(idx)}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={`${p.from.symbol}/${p.to.symbol}`} />
            </ListItem>
          )}
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
  }))
  const pairs = []
  tradeTokens.forEach(t => {
    const list = match(t)
    list.forEach(pair => pairs.push(pair))
  })

  return { pairs }
}

const actions = {

}

const storeConnect = connect(mapProps, actions)

export default storeConnect(TokenPairList)
