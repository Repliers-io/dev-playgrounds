/* eslint-disable import/prefer-default-export */
import queryString from 'query-string'

import defaultFormState from 'providers/ParamsFormProvider/defaults'

import { type ChatItem } from './types'

// Get all form field keys from default form state
const FORM_FIELDS = Object.keys(defaultFormState)

// Extract valid values for fields with select options
const getValidValues = (
  field: string,
  value: string | string[],
  selectOptions: Record<string, string[]>
): string | string[] | null => {
  const allowedValues = selectOptions[field]
  if (!allowedValues) {
    return value // Return original value if no validation needed
  }

  const values = Array.isArray(value) ? value : [value]
  const validValues = values.filter((v) => allowedValues.includes(v))
  const invalidValues = values.filter((v) => !allowedValues.includes(v))

  if (validValues.length > 0) {
    // eslint-disable-next-line no-console
    console.log(`[VALID] Field "${field}": ${validValues.join(', ')}`)
  }

  if (invalidValues.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      `[INVALID] Field "${field}": ${invalidValues.join(', ')}`,
      `\n   Available: [${allowedValues.join(', ')}]`
    )
  }

  // Return valid values in same format as input
  if (validValues.length === 0) return null
  return Array.isArray(value) ? validValues : validValues[0]
}

export const extractFilters = (
  obj: ChatItem,
  selectOptions?: Record<string, string[]>
): Record<string, any> => {
  const filters: Record<string, any> = {}
  // Check URL query parameters
  const parsed = queryString.parseUrl(obj.url || '')
  const queryKeys = Object.keys(parsed.query || {})
  if (parsed.query && queryKeys.length > 0) {
    const matchedFields = queryKeys.filter((key) => FORM_FIELDS.includes(key))
    const unknownFields = queryKeys.filter((key) => !FORM_FIELDS.includes(key))

    if (unknownFields.length > 0) {
      // eslint-disable-next-line no-console
      console.error(
        `[UNKNOWN FIELDS] Not present in form: ${unknownFields.join(', ')}`
      )
    }

    // Process matched fields
    matchedFields.forEach((field) => {
      const value = parsed.query[field] as string | string[]

      // Validate and filter values for fields with select options
      if (selectOptions && selectOptions[field]) {
        const validValue = getValidValues(field, value, selectOptions)
        if (validValue !== null) {
          filters[field] = validValue
        }
      } else {
        // No validation needed - use value as is
        filters[field] = value
      }
    })
  }

  // Check body fields
  const bodyKeys = Object.keys(obj.body || {})
  if (obj.body && bodyKeys.length > 0) {
    const matchedBodyFields = bodyKeys.filter((key) =>
      FORM_FIELDS.includes(key)
    )

    matchedBodyFields.forEach((field) => {
      filters[field] = obj.body![field]
    })
  }

  if (Object.keys(filters).length > 0) {
    // eslint-disable-next-line no-console
    console.log('[EXTRACTED FILTERS]', filters)
  }

  return filters
}

export const hasFilters = (
  obj: ChatItem,
  selectOptions?: Record<string, string[]>
): boolean => {
  const filters = extractFilters(obj, selectOptions)
  return Object.keys(filters).length > 0
}
