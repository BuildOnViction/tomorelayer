// ASYNC REQUEST CONFIGS
export const AsynCatch = promise => promise
  .then(data => [null, data])
  .catch(err => [err])

export const Client = {
  get: api => fetch(api).then(r => r.json()),
  post: (api, value) => fetch(api, {
    method: 'post',
    body: JSON.stringify(value),
    headers: {
      Accept: 'application/json; charset=UTF-8',
    },
  }).then(r => {
    if (r.ok) return r.json()
    throw new Error(r.json())
  }),
  delete: (api, value) => fetch(api, {
    method: 'delete',
    body: JSON.stringify(value),
    headers: {
      Accept: 'application/json; charset=UTF-8',
    },
  }).then(r => {
    if (r.ok) return r.json()
    throw new Error(r.json())
  }),
}

export const Alert = (state, variant, message) => {
  // One of special function to control Application Alert
  // Widely used accross the app so separated
  const open = true
  const newNotification = { open, message, variant }
  state.notifications = [...state.notifications, newNotification]
  return state
}

export const AlertVariant = {
  success: 'success',
  warning: 'warning',
  info: 'info',
  error: 'error',
}
