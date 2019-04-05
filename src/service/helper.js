/*
 * Basic function helpers
 */
const isFunction = t => typeof t === 'function'

/*
 * Resolve to function-argument
 */
const h = (f, v) => isFunction(f) ? f(v) : f

/*
 * Noop!
 */
const noop = () => undefined

const baseOr = (...args) => bol => {
  if (args.length === 0) { return bol }
  if (args.length === 1) { return bol && h(args[0], bol) }
  if (args.length === 2) { return bol ? h(args[0], bol) : h(args[1], bol) }
  if (args.length > 2) { return args.reduce((acc, current) => acc || h(current, bol)) }
}

/*
 * Usage: or(truthy | function to apply when true, falsy | function to apply when falsy..., ...other arguments to reduce if needed)(boolean function | boolean value)(value)
 * Can be curried with more than 3 arguments
 * With 2 arguments: valule => or(truthy-value | truthy function, falsy-value | falsy-function)(value)
 * With 3+ arguments: value => or(a1, a2, a3...)(value) // Will resolve to the first truthy value
 * Can be use with extra function to confirm boolean (_.isNil, _.isString, _.isNumber...): value => (or(a1, a2)(checkFuction))(value)
 */
export const or = (...args) => arg2 => !isFunction(arg2)
                                     ? (baseOr(...args))(arg2)
                                     : (lastValue => (baseOr(...args.map(a => h(a, lastValue))))(arg2(lastValue)))

// Set multiple properties of an object to null
export const flush = options => obj => {
  const { exclude, include } = options
  const includeFilter = k => include && include.length > 0 ? include.includes(k) : true
  const excludeFilter = k => exclude && exclude.length > 0 ? !exclude.includes(k) : true
  return Object.keys(obj).filter(includeFilter).filter(excludeFilter).forEach(k => { obj[k] = null })
}

// Resolve 2nd/3rd arguments when first argument is truthy
export const when = arg1 => ({
  do: arg2 => {
    if (!arg1 && isFunction(arg2)) return noop
    if (!arg1 && !isFunction(arg2)) return undefined
    if (arg1) return arg2
  }
})

export const assign = (src, dest) => Object.assign(src, dest)

export const match = pattern => (arg, config = {}) => {
  const fallback = pattern[config.default || 'default' || '_']
  const returnedValue = config.returnedValue
  return or(h(pattern[arg], returnedValue), h(fallback, returnedValue))(arg in pattern)
}

export const notEqual = (value1, value2) => value1 !== value2

export const intersect = (array1, array2) => array1.some(item => item in array2)

// Compose from left-most to right-most
export const compose = (...functions) => lastArg => functions
  .filter(isFunction)
  .reduce((returned, currentFunc) => currentFunc(returned), lastArg)

export const extract = (...keys) => ({
  from: obj => {
    const result = {}
    keys.forEach(k => result[k] = obj[k])
    return result
  }
})

export const safety_net = promise => promise
  .then(data => [null, data])
  .catch(err => [err])

export const isEmpty = something => {
  if (something === '') return true
  if (typeof something === 'object' && something.length === 0) return true
  if (typeof something === 'object' && Object.keys(something).length === 0) return true
  return false
}
