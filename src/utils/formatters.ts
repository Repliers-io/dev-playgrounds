import { currency as defaultCurrency } from 'constants/i18n'

const fractionDigits = 2
const numberFormat = 'en-US'

export type Primitive = string | number | boolean | bigint | null | undefined

export const toSafeNumber = (value: Primitive) => {
  if (typeof value === 'boolean') return value ? 1 : 0
  if (typeof value === 'string') return parseFloat(value) || 0
  if (
    typeof value !== 'number' ||
    Number.isNaN(value) ||
    !Number.isFinite(value)
  )
    return 0
  return value
}

export const toSafeString = (value: Primitive) => {
  return toSafeNumber(value).toString()
}

export const formatPercentage = (value: Primitive) => {
  const number = toSafeNumber(value)
  const sign = number > 0 ? '+' : ''
  return `${sign}${number}%`
}

export const formatLongNumber = (
  value: Primitive,
  fractions = fractionDigits
) => {
  const suffixes = ['', 'K', 'M', 'B', 'T']

  let precision
  let number = toSafeNumber(value)
  let rounded = number // initial value
  while (rounded >= 1e3 && suffixes.length > 1) {
    number /= 1e3
    precision = number >= 10 ? 1 : 10 ** fractions
    rounded = Math.round(number * precision) / precision
    suffixes.shift()
  }
  return `${rounded}${suffixes[0]}`
}

export const formatPrice = (value: Primitive, currency = '$') => {
  const number = toSafeNumber(value)
  return `${number < 0 ? '-' : ''}${currency}${formatLongNumber(number)}`
}

/**
 * This is the historical name of the "commas price" representation,
 * in opposite to the French (European) one, which uses spaces as separators.
 */
export const formatEnglishNumber = (
  value: Primitive,
  maximumFractionDigits = 2
) => {
  return new Intl.NumberFormat(numberFormat, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits
  }).format(toSafeNumber(value))
}

export type Currency = 'USD' | 'CAD' | 'EUR' | 'GBP'

export const formatEnglishPrice = (
  value: Primitive,
  maximumFractionDigits = 2,
  currency: Currency = defaultCurrency
) => {
  return new Intl.NumberFormat(numberFormat, {
    currency,
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits
  }).format(toSafeNumber(value))
}

export const toAffirmative = (value: Primitive | object) => {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'y' ? 'Yes' : 'No'
  }
  return value ? 'Yes' : 'No'
}

/**
 * Escape HTML characters to prevent XSS attacks
 */
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Add syntax highlighting to JSON string
 * Highlights:
 * - Keys in bold
 * - null values in red (#df113a)
 * - Numbers in blue (#0b75f5)
 */
export const highlightJSONKeys = (jsonString: string): string => {
  const escapedString = escapeHtml(jsonString)

  return escapedString
    .split('\n')
    .map((line) => {
      let processedLine = line

      // Match JSON keys: strings in quotes at the beginning of line (after whitespace)
      const keyPattern = /^(\s*)"([^&]+)"(\s*:\s*)/
      if (keyPattern.test(processedLine)) {
        processedLine = processedLine.replace(
          keyPattern,
          '$1<strong>$2</strong>$3'
        )
      }

      // Match null values
      const nullPattern = /(null)(?=,|\s*$|\s*[}\]])/g
      processedLine = processedLine.replace(
        nullPattern,
        '<span style="color: #df113a;">$1</span>'
      )

      // Match numbers (integers and floats)
      const numberPattern = /(-?\d+(?:\.\d+)?)(?=,|\s*$|\s*[}\]])/g
      processedLine = processedLine.replace(
        numberPattern,
        '<span style="color: #0b75f5;">$1</span>'
      )

      return processedLine
    })
    .join('\n')
}
