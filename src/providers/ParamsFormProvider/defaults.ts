import { type FormParams } from 'providers/SearchProvider'

import { defaultStatisticsFields, listingFields } from './types'

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

  /**
   * request parameters
   */
  boardId: undefined,
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
  cluster: undefined,
  clusterLimit: 100,
  clusterPrecision: 10,
  fields: listingFields.join(','),
  statistics: defaultStatisticsFields.join(',')
}

export default defaultFormState
