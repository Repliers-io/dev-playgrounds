import { listingFields } from 'services/Search/defaults'

import { type FormData } from './types'

const apiUrl = process.env.REACT_APP_REPLIERS_API_URL || ''
const apiKey = process.env.REACT_APP_REPLIERS_KEY || ''

const defaultFormState: FormData = {
  /**
   * @internal
   */
  clusterAutoSwitch: true,
  slidingClusterPrecision: true,

  /**
   * request parameters
   */
  apiUrl,
  apiKey,
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
