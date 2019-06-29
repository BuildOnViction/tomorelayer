import { bindActions } from '@vutr/redux-zero/utils'
import store from './store'

export const PushAlert = (state, { variant, message }) => {
  // One of special function to control Application Alert
  // Widely used accross the app so separated
  const open = true
  const newNotification = { open, message, variant }
  state.notifications = [...state.notifications, newNotification]
  return state
}

export const StatePushAlert = (variant, message) => bindActions({ PushAlert }, store).PushAlert({ variant, message })

export const AlertVariant = {
  success: 'success',
  warning: 'warning',
  info: 'info',
  error: 'error',
}
