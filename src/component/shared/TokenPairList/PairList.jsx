import React from 'react'
import {
  Box,
  List,
  Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const ListHeader = withStyles(theme => ({
  root: {
    padding: '20px 5px 5px 5px',
    borderBottom: `solid 1px ${theme.palette.tabInactive}`
  }
}))(Box)

const ListBoxWrapper = withStyles(theme => ({
  root: {
    height: 500,
    overflow: 'auto',
    paddingBottom: 10,
    position: 'relative',
    borderBottom: `solid 1px ${theme.palette.tabInactive}`,
  }
}))(Box)

export default class PairList extends React.Component {

  render() {
    const {
      children,
    } = this.props

    return (
      <React.Fragment>
        <ListHeader display="flex" justifyContent="space-between" alignItems="center" className="pr-1 pl-1">
          <Box>
            <Typography variant="body2" style={{ marginLeft: 4 }}>
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
          <List dense>
            {children}
          </List>
        </ListBoxWrapper>
      </React.Fragment>
    )
  }
}
