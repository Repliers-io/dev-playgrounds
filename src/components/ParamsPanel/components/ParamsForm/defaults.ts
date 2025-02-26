import { listingFields } from 'services/Search/defaults'

import { type FormData } from './types'

const defaultFormState: Partial<FormData> = {
  /**
   * @internal
   */
  dynamicClustering: true,
  dynamicClusterPrecision: true,

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
  fields: listingFields.join(',')
}

export default defaultFormState
