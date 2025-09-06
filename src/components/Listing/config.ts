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
    tooltip: 'Medium-sized listing images pulled from Repliers CDN',
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
  },
  duplicatesDetails: {
    hint: 'docs',
    link: 'https://help.repliers.com/en/article/access-to-multiple-mls-systems-using-a-single-api-key-deduplication-qe05dp/'
  },
  duplicates: {
    hint: 'docs',
    link: 'https://help.repliers.com/en/article/access-to-multiple-mls-systems-using-a-single-api-key-deduplication-qe05dp/'
  },
  permissions: {
    hint: 'docs',
    link: 'https://help.repliers.com/en/article/understanding-listing-permissions-in-the-api-yj6n9y/'
  },
  comparables: {
    hint: 'docs',
    link: 'https://help.repliers.com/en/article/sold-comparables-similar-active-listings-selection-logic-1h396j8/'
  },
  history: {
    hint: 'docs',
    link: 'https://help.repliers.com/en/article/accessing-historical-listings-for-an-address-1kfsor7/'
  },
  estimate: {
    hint: 'docs',
    link: 'https://help.repliers.com/en/article/ai-powered-property-estimates-implementation-guide-6gdbvp/#3-on-market-property-estimates'
  },
  imageInsights: {
    hint: 'docs',
    link: 'https://help.repliers.com/en/article/ai-powered-property-photo-classification-implementation-guide-l8jltq/'
  },
  timestamps: {
    hint: 'DOM docs',
    link: 'https://help.repliers.com/en/article/considerations-when-displaying-the-days-on-market-field-y2hu24/'
  }
}
