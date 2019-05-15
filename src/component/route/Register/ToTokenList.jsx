import React from 'react'
import {
  Checkbox,
  List,
  ListItemText,
  ListItemSecondaryAction,
  ListItem,
  ListItemAvatar,
  ListSubheader,
  Avatar,
  InputAdornment,
  TextField,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'


const ToTokenList = ({ tokens, fromToken, selected, onChange, disabled }) => {
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
        <ListItem key={token.id} button>
          <ListItemAvatar>
            <Avatar alt={token.name} src={token.logo} />
          </ListItemAvatar>
          <ListItemText primary={token.symbol} />
          <ListItemSecondaryAction>
            <Checkbox
              disabled={!fromToken || disabled(token.id)}
              checked={selected.includes(token.id) || disabled(token.id)}
              onChange={onChange(token.id)}
              color="primary"
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}

export default ToTokenList
