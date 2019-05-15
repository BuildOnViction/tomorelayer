import React from 'react'
import {
  List,
  ListItemText,
  ListItemSecondaryAction,
  ListItem,
  ListItemAvatar,
  ListSubheader,
  Avatar,
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
        <ListItem key={token.id} button>
          <ListItemAvatar>
            <Avatar
              alt={token.name}
              src={token.logo}
            />
          </ListItemAvatar>
          <ListItemText primary={token.symbol} />
          <ListItemSecondaryAction>
            <Radio
              color="primary"
              checked={token.id === selected}
              onChange={onChange(token.id)}
            />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  )
}

export default FromTokenList
