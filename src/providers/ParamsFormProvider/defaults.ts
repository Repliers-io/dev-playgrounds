import {
  defaultStatisticsFields,
  type FormParams,
  listingFields,
  locationsFields,
  listingFields
} from './types'

const defaultFormState: Partial<FormParams> = {
  /**
   * @internal
   */
  dynamicClustering: true,
  dynamicClusterPrecision: true,
  stats: false,
  tab: 'map',
  sections: '',
  grp: [],

  endpoint: 'locations',
  center: false,
  radius: null,
  search: '',
  locationsPageNum: null,
  locationsResultsPerPage: null,
  locationsType: [],
  locationsFields: locationsFields.join(','),
  locationId: '',
  area: '',
  city: '',
  neighborhood: '',
  areaOrCity: '',
  listingFields: listingFields.join(','),
  listingBoardId: undefined,

  /**
   * request parameters
   */
  boardId: undefined,
  mlsNumber: undefined,
  listings: undefined,
  class: [],
  status: [],
  lastStatus: [],
  type: [],
  style: [],
  propertyType: [],
  sortBy: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  minBedrooms: undefined,
  minBaths: undefined,
  minGarageSpaces: undefined,
  minParkingSpaces: undefined,
  resultsPerPage: undefined,
  cluster: undefined,
  clusterLimit: 100,
  clusterPrecision: 10,
  fields: listingFields.join(','),
  statistics: defaultStatisticsFields.join(',')
}

export default defaultFormState
