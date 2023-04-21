/**
 * 'abc' => 'Abc'
 *
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
function capitalize(value) {

  if (!value && value !== 0) {

    return ''
  }

  value = value.toString()

  return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * 'abc' => 'ABC'
 *
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
function uppercase(value) {

  return (value || value === 0)
    ? value.toString().toUpperCase()
    : ''
}

/**
 * 'AbC' => 'abc'
 *
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
function lowercase(value) {

  return (value || value === 0)
    ? value.toString().toLowerCase()
    : ''
}

/**
 *
 * @param  {[type]} value [description]
 * @return {[type]}       [description]
 */
function json(value, space = 4) {

  return JSON.stringify(value, null, space)
}

/**
 * 12345 => $12,345.00
 *
 * @param  {[type]} value    [description]
 * @param  {[type]} currency [description]
 * @return {[type]}          [description]
 */
function currency(value, currency) {
  const digitsRE = /(\d{3})(?=\d)/g

  value = parseFloat(value)

  if (!isFinite(value) || (!value && value !== 0)) {

    return ''
  }

  currency = currency !== null ? currency : '$'
  let stringified = Math.abs(value).toFixed(2)
  let _int = stringified.slice(0, -3)
  let i = _int.length % 3
  let head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
    : ''
  let _float = stringified.slice(-3)
  let sign = value < 0 ? '-' : ''

  return currency + sign + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float
}

export {
  capitalize,
  uppercase,
  lowercase,
  currency,
  json
}
