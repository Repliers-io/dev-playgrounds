import { defaultStatisticsFields, type FormData, listingFields } from './types'

const defaultFormState: Partial<FormData> = {
  /**
   * @internal
   */
  dynamicClustering: true,
  dynamicClusterPrecision: true,
  stats: false,
  tab: 'map',
  sections: '',
  grp: null,

  /**
   * request parameters
   */
  boardId: null,
  listings: null,
  class: [],
  status: [],
  lastStatus: [],
  type: [],
  style: [],
  propertyType: [],
  sortBy: '',
  minPrice: null,
  maxPrice: null,
  minBedrooms: null,
  minBaths: null,
  minGarageSpaces: null,
  minParkingSpaces: null,
  cluster: null,
  clusterLimit: 100,
  clusterPrecision: 10,
  fields: listingFields.join(','),
  statistics: defaultStatisticsFields.join(',')
}

export default defaultFormState
