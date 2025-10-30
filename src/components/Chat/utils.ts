/* eslint-disable import/prefer-default-export */
import queryString from 'query-string'

import defaultFormState from 'providers/ParamsFormProvider/defaults'

import { type ChatItem } from './types'

// Get all form field keys from default form state
const FORM_FIELDS = Object.keys(defaultFormState)

// Determine which fields should be arrays based on their default values
const ARRAY_FIELDS = Object.entries(defaultFormState)
  .filter(([, value]) => Array.isArray(value))
  .map(([key]) => key)

// Extract valid values for fields with select options
// Returns { valid, invalid } where invalid contains values that didn't pass validation
const getValidValues = (
  field: string,
  value: string | string[],
  selectOptions: Record<string, string[]>
): { valid: string | string[] | null; invalid: string[] } => {
  const allowedValues = selectOptions[field]
  if (!allowedValues) {
    return { valid: value, invalid: [] } // No validation needed
  }

  const values = Array.isArray(value) ? value : [value]
  const validValues = values.filter((v) => allowedValues.includes(v))
  const invalidValues = values.filter((v) => !allowedValues.includes(v))

  if (invalidValues.length > 0) {
    // eslint-disable-next-line no-console
    console.error(
      `[INVALID] Field "${field}": ${invalidValues.join(', ')}`,
      `\n   Available: [${allowedValues.join(', ')}]`
    )
  }

  // Return valid values - always as array for array fields
  const valid =
    validValues.length === 0
      ? null
      : ARRAY_FIELDS.includes(field)
        ? validValues
        : validValues[0]

  return { valid, invalid: invalidValues }
}

export const extractFilters = (
  obj: ChatItem,
  selectOptions?: Record<string, string[]>
): { filters: Record<string, any>; unknowns: Record<string, any> } => {
  const filters: Record<string, any> = {}
  const unknowns: Record<string, any> = {}

  // Check URL query parameters
  const parsed = queryString.parseUrl(obj.url || '')
  const queryKeys = Object.keys(parsed.query || {})
  if (parsed.query && queryKeys.length > 0) {
    const matchedFields = queryKeys.filter((key) => FORM_FIELDS.includes(key))
    const unknownFields = queryKeys.filter((key) => !FORM_FIELDS.includes(key))

    // Store unknown fields
    if (unknownFields.length > 0) {
      // eslint-disable-next-line no-console
      console.error(
        `[UNKNOWN FIELDS] Not present in form: ${unknownFields.join(', ')}`
      )
      unknownFields.forEach((field) => {
        unknowns[field] = parsed.query[field]
      })
    }

    // Process matched fields
    matchedFields.forEach((field) => {
      let value = parsed.query[field] as string | string[]

      // Ensure array fields are always arrays
      if (ARRAY_FIELDS.includes(field) && !Array.isArray(value)) {
        value = [value]
      }

      // Validate and filter values for fields with select options
      if (selectOptions && selectOptions[field]) {
        const { valid, invalid } = getValidValues(field, value, selectOptions)
        if (valid !== null) {
          filters[field] = valid
        }
        // Store invalid values in unknowns
        if (invalid.length > 0) {
          unknowns[field] = ARRAY_FIELDS.includes(field) ? invalid : invalid[0]
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
    const unknownBodyFields = bodyKeys.filter(
      (key) => !FORM_FIELDS.includes(key)
    )

    // Store unknown body fields
    if (unknownBodyFields.length > 0) {
      unknownBodyFields.forEach((field) => {
        unknowns[field] = obj.body![field]
      })
    }

    matchedBodyFields.forEach((field) => {
      let value = obj.body![field]
      // Ensure array fields are always arrays
      if (ARRAY_FIELDS.includes(field) && !Array.isArray(value)) {
        value = [value]
      }
      filters[field] = value
    })
  }

  return { filters, unknowns }
}

export const hasFilters = (
  obj: ChatItem,
  selectOptions?: Record<string, string[]>
): boolean => {
  const { filters, unknowns } = extractFilters(obj, selectOptions)
  return Object.keys(filters).length > 0 || Object.keys(unknowns).length > 0
}
