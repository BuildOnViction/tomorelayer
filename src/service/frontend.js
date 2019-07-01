export const AlertVariant = {
  success: 'success',
  warning: 'warning',
  info: 'info',
  error: 'error',
}

export const PushAlert = (state, { variant, message }) => {
  // One of special function to control Application Alert
  // Widely used accross the app so separated
  const open = true
  const newNotification = { open, message, variant }
  const notifications = [...state.notifications, newNotification]
  return { notifications }
}
