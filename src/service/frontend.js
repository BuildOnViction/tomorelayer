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

export const FuzzySearch = async (pouch, fuzzyString) => {
  let result = []

  if (fuzzyString && fuzzyString.length >= 3 && pouch) {
    const regex = new RegExp(fuzzyString, 'i', 'g')
    result = await pouch.find({
      selector: {
        fuzzy: {
          '$regex': regex
        }
      }
    }).then(resp => resp.docs).catch(() => undefined)
  }

  return result
}

export const PouchDelete = async (pouch, id) => {
  const doc = await pouch.get(id)
  const resp = await pouch.remove(doc)
  return resp.ok
}
