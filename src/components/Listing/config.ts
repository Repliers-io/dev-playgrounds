import type { HideEmptyValuesOptions } from './types'

// Configuration for property display order

// Order for all sections (including root for simple properties)
export const sectionOrder = ['images', 'root', 'address', 'details', 'history']

// Sections to hide completely
export const hiddenSections = [
  // Technical metadata
]

// Options for hiding empty/null values
export const hideEmptyValues: HideEmptyValuesOptions = {
  hideNull: true,
  hideUndefined: true,
  hideEmptyStrings: true,
  hideEmptyArrays: true,
  hideEmptyObjects: true
}

// Sections that should be expanded by default
export const expandedSections = ['images', 'root', 'address']
