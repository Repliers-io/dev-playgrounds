import type { HideEmptyValuesOptions, SectionHeaderConfig } from './types'

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

// Configuration for section headers with additional styling
export const sectionHeaders: Record<string, SectionHeaderConfig> = {
  images: {
    tooltip: 'Listing images',
    hint: 'docs',
    link: 'https://help.repliers.com/en/article/listing-images-implementation-guide-198p8u8/'
  },
  root: {
    tooltip:
      'This is automatically generated section which contains root level fields from the listing object'
  }
}
