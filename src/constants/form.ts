import {
  type CustomFormParams,
  type FormParams
} from 'providers/ParamsFormProvider'

export const apiFields = [
  'details.style',
  'details.propertyType',
  'lastStatus',
  'standardStatus'
] as const

export const locationsApiFields = [
  'source',
  'type',
  'subType',
  'classification',
  'school.schoolType',
  'school.schoolLevel',
  'school.privateSchoolAffiliation',
  'school.districtName'
] as const

export const locationsApiFieldsMappings: Partial<
  Record<(typeof locationsApiFields)[number], string>
> = {
  source: 'locationsSource',
  type: 'locationsType',
  subType: 'locationsSubType',
  classification: 'locationsClassification',
  'school.schoolType': 'schoolType',
  'school.schoolLevel': 'schoolLevel',
  'school.privateSchoolAffiliation': 'privateSchoolAffiliation',
  'school.districtName': 'schoolDistrictName'
}

// location aggregate fields whose options should be sorted alphabetically
// instead of by the default descending-count order
export const locationsAlphabeticalFields: readonly string[] = ['type']

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
  'nlpLat',
  'nlpLong',
  'nlpUseLocationId',
  'nlpLocationsSource',
  'unknowns'
]

export const listingOnlyParams: (keyof FormParams)[] = [
  'mlsNumber',
  'listingFields',
  'listingBoardId',
  'listingLocations',
  'listingLocationsSource',
  'listingLocationsType'
]

export const listingsOnlyParams: (keyof FormParams)[] = []

export const clusterOnlyParams: (keyof FormParams)[] = [
  'clusterLimit',
  'clusterPrecision',
  'clusterFields',
  'clusterListingsThreshold'
]

export const statsOnlyParams: (keyof FormParams)[] = ['statistics', 'grp']

export const searchOnlyParams: (keyof FormParams)[] = [
  'endpoint',
  'search',
  'locationsType',
  'locationsSubType',
  'locationsClassification',
  'locationsSortBy',
  'locationsFields',
  'locationsBoundary',
  'locationsHasBoundary',
  'locationsPageNum',
  'locationsResultsPerPage',
  'locationsLocationId',
  'locationsSource',
  'locationsMinSize',
  'locationsMaxSize',
  'locationsPointWithinBoundary',
  'name',
  'schoolType',
  'schoolLevel',
  'privateSchoolAffiliation',
  'schoolDistrictName'
]
