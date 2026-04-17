import {
  defaultStatisticsFields,
  type FormParams,
  listingFields,
  locationsFields
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
  locationsSubType: [],
  locationsClassification: [],
  locationsSortBy: undefined,
  locationsFields: locationsFields.join(','),
  locationsLocationId: '',
  locationsSource: [],
  locationsMinSize: null,
  locationsMaxSize: null,
  name: '',
  schoolType: [],
  schoolLevel: [],
  privateSchoolAffiliation: [],
  schoolDistrictName: [],
  state: '',
  area: '',
  city: '',
  neighborhood: '',
  areaOrCity: '',
  listingFields: null,
  listingBoardId: undefined,
  listingLocations: null,
  listingLocationsSource: [],
  listingLocationsType: [],

  /**
   * request parameters
   */
  boardId: undefined,
  mlsNumber: undefined,
  listings: undefined,
  class: [],
  status: [],
  lastStatus: [],
  standardStatus: [],
  type: [],
  style: [],
  propertyType: [],
  sortBy: undefined,
  minPrice: undefined,
  maxPrice: undefined,
  overallQuality: [],
  bedroomQuality: [],
  bathroomQuality: [],
  livingRoomQuality: [],
  diningRoomQuality: [],
  kitchenQuality: [],
  frontOfStructureQuality: [],
  minBedrooms: undefined,
  maxBedrooms: undefined,
  minBaths: undefined,
  maxBaths: undefined,
  minGarageSpaces: undefined,
  maxGarageSpaces: undefined,
  minParkingSpaces: undefined,
  maxParkingSpaces: undefined,
  resultsPerPage: undefined,
  cluster: undefined,
  clusterLimit: 100,
  clusterPrecision: 10,
  fields: listingFields.join(','),
  statistics: defaultStatisticsFields.join(','),
  imageSearchItems: [],
  textSearchItems: {
    model: 'small',
    items: []
  },
  minListDate: undefined,
  maxListDate: undefined,
  minSoldDate: undefined,
  maxSoldDate: undefined,
  minUpdatedOn: undefined,
  maxUpdatedOn: undefined,

  /**
   * chat parameters
   */
  nlpVersion: '3',
  nlpId: '',
  clientId: '',
  nlpListings: null,
  nlpFields: '',
  nlpUseLocationId: 'true',
  nlpLat: null,
  nlpLong: null,
  unknowns: {}
}

export default defaultFormState
