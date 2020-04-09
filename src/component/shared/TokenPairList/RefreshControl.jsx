import React from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const Spinner = withStyles({
  root: {
    width: '17px !important',
    height: '17px !important',
    marginRight: 10,
  }
})(CircularProgress)

const RefreshButton = withStyles(theme => ({
  root: {
    fontSize: 14,
    color: theme.palette.link,
    textTransform: 'none',
    padding: '0px 8px',
    '&:hover': {
      background: 'transparent',
      textDecoration: 'underline',
    },
  }
}))(props => <Button {...props} variant="text" />)

const RefreshControlContainer = withStyles(theme => ({
  root: {
    padding: '0.5em',
    background: `${theme.palette.tabInactive}66`,
    borderRadius: '0 0 8px 8px',
  },
}))(Box)

const RefreshControl = ({
  notifyDex,
  onRefresh,
  disabled,
}) => (
  <RefreshControlContainer display="flex" justifyContent="flex-end" alignItems="center">
    {disabled ? (
      <Box>
        <Spinner />
      </Box>
    ): (
      <React.Fragment>
        <Box>
          <Typography variant="body2" className="m-0">
            Not seeing your tokens?
          </Typography>
        </Box>
        <Box>
          <RefreshButton onClick={onRefresh}>
            Refresh now
          </RefreshButton>
        </Box>
      </React.Fragment>
    )}
  </RefreshControlContainer>
)

export default RefreshControl
