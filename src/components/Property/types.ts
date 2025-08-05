// Type definitions for Property component configuration

export interface HideEmptyValuesOptions {
  hideNull?: boolean
  hideUndefined?: boolean
  hideEmptyStrings?: boolean
  hideEmptyArrays?: boolean
  hideEmptyObjects?: boolean
}

export interface PropertyDisplayOptions {
  sectionOrder?: string[]
  hiddenSections?: string[]
  hideEmptyValues?: HideEmptyValuesOptions
  expandedSections?: string[]
}

export interface PropertyTypeConfig {
  sectionOrder: string[]
  fieldOrder: string[]
  hiddenSections?: string[]
  hiddenFields?: string[]
}

export interface PropertyConfigMap {
  [propertyType: string]: PropertyTypeConfig
}
