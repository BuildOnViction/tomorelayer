import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import cx from 'classnames'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import { amber, green } from '@material-ui/core/colors'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import WarningIcon from '@material-ui/icons/Warning'
import { makeStyles } from '@material-ui/core/styles'


const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
}

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}))

const MySnackbarContentWrapper = props => {
  const classes = useStyles()
  const { className, message, onClose, variant, ...other } = props
  const Icon = variantIcon[variant]

  return (
    <SnackbarContent
      className={cx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={cx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      {...other}
    />
  )
}

const Alert = props => {
  const { notifications, selfClose } = props
  const anchor = {vertical: 'bottom', horizontal: 'right'}

  const alertDuration = {
    success: 2000,
    info: 1500,
    error: 4000,
    warning: 2000,
  }

  const alertElementHeight = 58
  // When anchored from top, need offset to re-calculate position
  // const offset = notifications.findIndex(n => n.open)
  const positioning = idx => `translateY(-${alertElementHeight * (notifications.length - idx - 1)}px)`
  return (
    <React.Fragment>
      {notifications.map((n, idx) => (
        <Snackbar
          key={idx}
          anchorOrigin={anchor}
          open={n.open}
          autoHideDuration={alertDuration[n.variant] + idx * 100}
          onClose={() => selfClose(idx)}
          style={{ transform: positioning(idx), transition: 'transform .1s' }}
        >
          <MySnackbarContentWrapper
            variant={n.variant}
            message={n.message}
          />
        </Snackbar>
      ))}
    </React.Fragment>
  )
}

const mapProps = state => ({
  notifications: state.notifications
})

const actions = store => ({
  selfClose: (state, index) => {
    let notifications = Array.from(state.notifications)
    notifications[index].open = false
    const anyOpenAlert = notifications.find(n => n.open)
    if (!anyOpenAlert) {notifications = []}
    return { notifications }
  }
})

const storeConnect = connect(mapProps, actions)
export default storeConnect(Alert)
