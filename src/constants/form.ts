import {
  type CustomFormParams,
  type FormParams
} from 'providers/SearchProvider'

export const apiFields = ['details.style', 'details.propertyType', 'lastStatus']

export const apiFieldsMappings = {
  'details.style': 'style',
  'details.propertyType': 'propertyType'
}

export const customFormParams: (keyof CustomFormParams)[] = [
  'dynamicClustering',
  'dynamicClusterPrecision',
  'stats',
  'grp',
  'tab',
  'sections'
]

export const clusterOnlyParams: (keyof FormParams)[] = [
  'clusterLimit',
  'clusterPrecision'
]

export const statsOnlyParams: (keyof FormParams)[] = [
  'statistics',
  'minListDate',
  'maxListDate',
  'minSoldDate',
  'maxSoldDate'
]
