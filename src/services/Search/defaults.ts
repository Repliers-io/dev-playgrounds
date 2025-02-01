import type { ApiQueryParamsAllowedFields, Listing } from 'services/API/types'

// eslint-disable-next-line import/prefer-default-export
export const listingFields: Array<
  keyof Listing | ApiQueryParamsAllowedFields | 'images[0]'
> = [
  'boardId',
  'mlsNumber',
  'status',
  'class',
  'listPrice',
  'listDate',
  'soldPrice',
  'soldDate',
  'map',
  'images[0]',
  'updatedOn'
  // 'lastStatus',
  // 'address',
  // 'imagesScore',
  // 'details.numBathrooms',
  // 'details.numBathroomsPlus',
  // 'details.numBedrooms',
  // 'details.numBedroomsPlus',
  // 'details.propertyType',
  // 'details.sqft',
  // 'details.style',
  // 'lot',
]
