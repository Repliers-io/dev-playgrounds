import { type Primitive } from './formatters'

export const capitalize = (str: Primitive) =>
  typeof str === 'string'
    ? str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase())
    : ''

export const pluralize = (
  count: number,
  forms: { one: string; many: string; zero?: string }
): string => {
  const word =
    forms[
      Math.abs(count) === 1
        ? 'one'
        : typeof forms.zero !== 'undefined' && count === 0
          ? 'zero'
          : 'many'
    ]
  return word!.replace('$', Number(count).toLocaleString())
}

export const joinNonEmpty = (items: Primitive[], separator = ', ') => {
  return items
    .map((x) => String(x || '').trim())
    .filter(Boolean)
    .join(separator)
}
/**
 * @deprecated should be replaced with array operations
 */
export const addSpaceAfterComma = (input: unknown) => {
  if (typeof input !== 'string') return null
  return input.replace(/,/g, ', ')
}

export const removeDuplicates = (items: Primitive[]) => {
  return [...new Set(items)]
}

export const random = (length = 8) => {
  const characters: string =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  if (!Number.isFinite(length) || length < 1) return result
  while (result.length < length) {
    // eslint-disable-next-line no-bitwise
    const randomIndex = (Math.random() * characters.length) << 0
    result += characters[randomIndex]
  }

  return result
}

export const formatUnionKey = (value: string): string => {
  return value
    .split(/(?=[A-Z0-9])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
