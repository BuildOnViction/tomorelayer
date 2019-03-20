/*
 * Basic function helpers
 */
const isFunction = t => typeof t === 'function'

/*
 * Resolve to function-argument
 */
const h = (f, v) => isFunction(f) ? f(v) : f

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
export const when = arg1 => arg2 => arg1 ? arg2 : null

export const assign = (src, dest) => Object.assign(src, dest)

interface IMatcherConfig {
  returnedValue?: any
  default?: string
}

export const matcher = pattern => (arg, config: IMatcherConfig = {}) => arg in pattern
                                                                      ? pattern[arg](config.returnedValue)
                                                                      : pattern[config.default || 'default'](config.returnedValue)
