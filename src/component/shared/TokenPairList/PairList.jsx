import React from 'react'
import {
  Box,
  Checkbox,
  List,
  Typography,
  InputLabel,
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

const SmallCheckbox = withStyles(theme => ({
  root: {
    color: theme.palette.maintitle,
    height: 5,
    width: 5,
    marginLeft: 10,
    opacity: .3,
    '& svg': {
      fontSize: '1rem',
    }
  },
  checked: {
    opacity: 1,
    '& svg': {
      color: theme.palette.link,
    }
  },
  disabled: {
    opacity: 1,
    color: `${theme.palette.maintitle}33 !important`,
  }
}))(Checkbox)

const SelectedOnlyLabel = withStyles(theme => ({
  root: {
    display: 'inline-block',
    color: theme.palette.subtitle,
    cursor: 'pointer'
  }
}))(InputLabel)

export default class PairList extends React.Component {

  render() {
    const {
      children,
      selectedOnly,
      setSelectedOnly,
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
              <SelectedOnlyLabel htmlFor="selected-only">Selected only</SelectedOnlyLabel> 
              <SmallCheckbox id="selected-only" disableRipple checked={selectedOnly} onChange={setSelectedOnly} />
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
