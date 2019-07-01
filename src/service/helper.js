/*
 * Basic function helpers
 */
const isFunction = t => typeof t === 'function'

/*
 * Noop!
 */
export const noop = () => undefined

export const notEqualTo = value1 => value2 => value1 !== value2

// Compose from left-most to right-most
export const compose = (...functions) => lastArg => functions
  .filter(isFunction)
  .reduce((returned, currentFunc) => currentFunc(returned), lastArg)

export const isEmpty = something => {
  if (something === '') return true
  if (typeof something === 'object' && something.length === 0) return true
  if (typeof something === 'object' && Object.keys(something).length === 0) return true
  return false
}

export const round = (value, precision) => {
  const multiplier = 10 ** (precision || 0);
  return (Math.round(value * multiplier) / multiplier).toFixed(precision);
}

export const compareString = (stra, strb, caseSensitive = false) => {
  if (!caseSensitive) {
    return stra.toLowerCase() === strb.toLowerCase()
  }

  return stra === strb
}

export const last = someArray => {
  if (!someArray || !someArray.length) return undefined
  const length = someArray.length
  return someArray[length - 1]
}

export const first = someArray => {
  if (!someArray || !someArray.length) return undefined
  return someArray[0]
}

export const ThrowOn = (shit, message) => {
  if (shit) {
    throw message
  }
}
