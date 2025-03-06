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
  'dynamicClusterPrecision'
]

export const clusterOnlyParams: (keyof FormParams)[] = [
  'clusterLimit',
  'clusterPrecision'
]
