/*
 * Basic function helpers
 */
const isFunction = (t) => typeof t === 'function'

// Compose from left-most to right-most
export const compose = (...functions) => (lastArg) =>
  functions.filter(isFunction).reduce((returned, currentFunc) => currentFunc(returned), lastArg)

export const isEmpty = (something) => {
  if (something === '') {return true}
  if (typeof something === 'object' && something.length === 0) {return true}
  if (typeof something === 'object' && Object.keys(something).length === 0) {return true}
  return false
}

export const round = (value, precision) => {
  const multiplier = 10 ** (precision || 0)
  return (Math.round(value * multiplier) / multiplier).toFixed(precision)
}

export const compareString = (stra, strb, caseSensitive = false) => {
  if (!caseSensitive) {
    return stra.toLowerCase() === strb.toLowerCase()
  }

  return stra === strb
}

export const ThrowOn = (shit, message) => {
  if (shit) {
    throw message
  }
}
