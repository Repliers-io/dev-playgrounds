import {
  type CustomFormParams,
  type FormParams
} from 'providers/ParamsFormProvider'

export const apiFields = [
  'details.style',
  'details.propertyType',
  'lastStatus'
] as const

export const apiFieldsMappings: Partial<
  Record<(typeof apiFields)[number], string>
> = {
  'details.style': 'style',
  'details.propertyType': 'propertyType'
}

export const customFormParams: (keyof CustomFormParams)[] = [
  'dynamicClustering',
  'dynamicClusterPrecision',
  'stats',
  'grp',
  'tab',
  'sections',
  'center',
  'nlpVersion',
  'nlpId',
  'unknowns'
]

export const listingOnlyParams: (keyof FormParams)[] = [
  'mlsNumber',
  'listingFields',
  'listingBoardId'
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

export const searchOnlyParams: (keyof FormParams)[] = [
  'endpoint',
  'search',
  'locationsType',
  'locationsSortBy',
  'locationsFields',
  'locationsBoundary',
  'locationsHasBoundary',
  'locationsPageNum',
  'locationsResultsPerPage',
  'locationId',
  'radius'
]
