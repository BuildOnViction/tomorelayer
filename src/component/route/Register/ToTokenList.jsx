import React from 'react'
import {
  Checkbox,
  List,
  ListItemText,
  ListItem,
  ListSubheader,
  InputAdornment,
  TextField,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'


const ToTokenList = ({ tokens, fromToken, selected, onChange, disabled }) => {
  const shouldDisable = id => !fromToken || disabled(id)

  const shouldBeChecked = id => {
    if (!fromToken) return false
    return selected.includes(id) || shouldDisable(id)
  }

  const handleClick = tokenId => event => {
    const alreadyPicked = disabled(tokenId)
    if (!alreadyPicked) onChange(tokenId)
  }

  return (
    <List dense className="border-all token-list bg-filled pt-0">
      <ListSubheader className="border-bottom p-1">
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
          fullWidth
        />
      </ListSubheader>
      {tokens.filter(t => t.id !== fromToken).map((token, idx) => (
        <ListItem key={token.id} button dense onClick={handleClick(token.id)} className="p-0">
          <Checkbox
            disabled={shouldDisable(token.id)}
            checked={shouldBeChecked(token.id)}
            color="primary"
            className="pr-0"
          />
          <ListItemText primary={token.symbol} />
        </ListItem>
      ))}
    </List>
  )
}

export default ToTokenList
