import type { HideEmptyValuesOptions, PropertyDisplayOptions } from './types'

// Helper function to check if value should be hidden (empty/null)
const isEmptyValue = (
  value: unknown,
  hideOptions: HideEmptyValuesOptions = {}
): boolean => {
  const {
    hideNull = true,
    hideUndefined = true,
    hideEmptyStrings = true,
    hideEmptyArrays = true,
    hideEmptyObjects = true
  } = hideOptions

  if (hideNull && value === null) return true
  if (hideUndefined && value === undefined) return true
  if (hideEmptyStrings && value === '') return true
  if (hideEmptyArrays && Array.isArray(value) && value.length === 0) return true
  if (
    hideEmptyObjects &&
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 0
  )
    return true

  return false
}

// Helper function to check if value is a simple type
const isSimpleValue = (value: unknown): boolean => {
  return (
    value === null ||
    value === undefined ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  )
}

// Universal helper function to sort any object properties
const sortProperties = (
  properties: Record<string, unknown>,
  order?: string[]
): Record<string, unknown> => {
  if (!order || order.length === 0) {
    // Just sort alphabetically if no order specified
    const sorted: Record<string, unknown> = {}
    Object.keys(properties)
      .sort()
      .forEach((key) => {
        sorted[key] = properties[key]
      })
    return sorted
  }

  const sortedProperties: Record<string, unknown> = {}

  // First, add properties in the specified order
  order.forEach((key) => {
    if (key in properties) {
      sortedProperties[key] = properties[key]
    }
  })

  // Then add any remaining properties not in the order (sorted alphabetically)
  Object.keys(properties)
    .filter((key) => !order.includes(key))
    .sort()
    .forEach((key) => {
      sortedProperties[key] = properties[key]
    })

  return sortedProperties
}

// Universal helper function to filter properties
const filterProperties = (
  properties: Record<string, unknown>,
  hiddenKeys: string[] = [],
  hideEmptyOptions: HideEmptyValuesOptions = {}
): Record<string, unknown> => {
  const filtered: Record<string, unknown> = {}

  Object.entries(properties).forEach(([key, value]) => {
    // Skip if key is in hidden list
    if (hiddenKeys.includes(key)) return

    // Skip if value is empty and should be hidden
    if (isEmptyValue(value, hideEmptyOptions)) return

    filtered[key] = value
  })

  return filtered
}

// Main function to process all properties as sections with universal sorting and filtering
export const separateProperties = (
  property: Record<string, unknown>,
  options?: PropertyDisplayOptions
) => {
  const allSections: Record<string, unknown> = {}
  const rootSection: Record<string, unknown> = {}

  // Separate simple properties into root section and keep complex as-is
  Object.entries(property).forEach(([key, value]) => {
    if (isSimpleValue(value)) {
      rootSection[key] = value
    } else {
      allSections[key] = value
    }
  })

  // Add root section if it has properties
  if (Object.keys(rootSection).length > 0) {
    allSections.root = rootSection
  }

  // Filter and sort all sections universally
  const filteredSections = filterProperties(
    allSections,
    options?.hiddenSections,
    options?.hideEmptyValues
  )
  const sortedSections = sortProperties(filteredSections, options?.sectionOrder)

  // Convert to array to preserve order
  const sortedSectionEntries = Object.entries(sortedSections)

  return sortedSectionEntries
}

// Helper function to check if value should be hidden in Section display
export const shouldHideValue = (value: unknown): boolean => {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    value === 'null' ||
    value === 'undefined'
  )
}

// Helper function to format simple values for Section display
export const formatSimpleValue = (value: unknown): string => {
  if (value === null) return 'null'
  if (value === undefined) return 'undefined'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  return String(value)
}

// Helper function to get section title for Section display
export const getSectionTitle = (key: string): string => {
  if (key === 'root') return '_root'
  return key
}
