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
    tooltip: 'Listing images pulled from Repliers CDN',
    hint: 'docs',
    link: 'https://help.repliers.com/en/article/listing-images-implementation-guide-198p8u8/'
  },
  root: {
    tooltip:
      'Automatically generated section containing root-level fields from the listing JSON object'
  },
  raw: {
    tooltip:
      'MLS®-specific fields not mapped to Repliers standardized data dictionary',
    hint: 'docs',
    link: 'https://help.repliers.com/en/article/raw-mls-data-access-with-repliers-nhlg5o/'
  },
  openHouse: {
    tooltip: 'Open House details for the listing',
    hint: 'docs',
    link: 'https://help.repliers.com/en/article/how-to-search-for-listings-with-open-houses-1dzsry0/'
  }
}
