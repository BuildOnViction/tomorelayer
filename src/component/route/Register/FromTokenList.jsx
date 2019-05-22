import React from 'react'
import {
  List,
  ListItemText,
  ListItem,
  ListSubheader,
  InputAdornment,
  TextField,
  Radio,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

const FromTokenList = ({ tokens, selected, onChange }) => {
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
      {tokens.map((token, idx) => (
        <ListItem key={token.id} button dense onClick={onChange(token.id)} className="p-0">
          <Radio color="primary" checked={token.id === selected} className="pr-0" />
          <ListItemText primary={token.symbol} />
        </ListItem>
      ))}
    </List>
  )
}

export default FromTokenList
