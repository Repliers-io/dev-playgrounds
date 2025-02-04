import { listingFields } from 'services/Search/defaults'

import { type FormData } from './types'

const defaultFormState: Partial<FormData> = {
  /**
   * @internal
   */
  clusterAutoSwitch: true,
  slidingClusterPrecision: true,

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
  clusterLimit: null,
  clusterPrecision: null,
  fields: listingFields.join(',')
}

export default defaultFormState
