/*
 * Basic function helpers
 */
const isFunction = (t) => typeof t === 'function'

// Compose from left-most to right-most
export const compose = (...functions) => (lastArg) =>
  functions.filter(isFunction).reduce((returned, currentFunc) => currentFunc(returned), lastArg)

export const isEmpty = (something) => {
  if (!something) {
    return true
  }
  if (something === '') {
    return true
  }
  if (typeof something === 'object' && something.length === 0) {
    return true
  }
  if (typeof something === 'object' && Object.keys(something).length === 0) {
    return true
  }
  return false
}

export const round = (value, precision) => {
  const multiplier = 10 ** (precision || 0)
  return (Math.round(value * multiplier) / multiplier).toFixed(precision)
}

export const strEqual = (...args) => {
  if (args.length >= 2) {
    const stringA = args[0]
    const stringB = args[1]
    return stringA.toLowerCase() === stringB.toLowerCase()
  }

  if (args.length === 1) {
    const stringA = args[0]
    const compare = (stringB) => stringA.toLowerCase() === stringB.toLowerCase()
    return compare
  }
}

export const ThrowOn = (shit, message) => {
  if (shit) {
    throw message
  }
}

export const inArray = (...args) => {
  if (args.length === 1) {
    const item = args[0]
    return (someArray) => someArray.indexOf(item) >= 0
  }

  if (args.length >= 2) {
    const [item, someArray] = args
    return someArray.indexOf(item) >= 0
  }
}

export const onlyKeys = (...keys) => (obj) => {
  const result = {}

  keys.forEach((key) => {
    result[key] = obj[key]
  })

  return result
}

export const unique = (array) => array.filter((item, index) => array.indexOf(item) === index)

export const uniqueBy = (array, key) =>
  array.filter((item, index) => array.findIndex((i) => i[key] === item[key]) === index)

export class TabMap {
  constructor(...args) {
    if (args.length < 2 || args.some((v) => typeof v !== 'string')) {
      throw new Error('Invalid constructor params for TabMap')
    }

    args.forEach((value, index) => {
      Object.defineProperties(this, {
        [value.toLowerCase().replace(/\s+/g, '_')]: {
          value: value,
          writable: false,
        },
        [index]: {
          value: value,
          writable: false,
        },
      })
    })

    this._length = args.length
    this._values = args
    this._keys = args.map((v) => v.toLowerCase())
    this._valueArray = [...args]
    return this
  }

  get length() {
    return this._length
  }

  get values() {
    return this._values
  }

  get keys() {
    return this._keys
  }

  getByIndex(index) {
    return this.values[index]
  }

  map(...args) {
    return this.values.map(...args)
  }

  getIndex(value) {
    return this._valueArray.indexOf(value)
  }
}
