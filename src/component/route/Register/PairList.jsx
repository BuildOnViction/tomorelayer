import React from 'react'
import {
  Button,
  List,
  ListItem,
  ListSubheader,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
} from '@material-ui/core'


const PairList = ({ pairs, removePair }) => {
  return (
    <List dense className="border-all token-list bg-filled pt-0">
      <ListSubheader className="border-bottom p-1">
        <Typography component="h4">
          Selected Pairs
        </Typography>
      </ListSubheader>
      {pairs.map(p =>
        <ListItem key={`${p.from.id}-${p.to.id}`} className="p-1">
          <ListItemText primary={`${p.from.symbol}/${p.to.symbol}`} />
          <ListItemSecondaryAction>
            <Button
              color="secondary"
              size="small"
              onClick={removePair(p)}>
              remove
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      )}
    </List>
  )
}

export default PairList
