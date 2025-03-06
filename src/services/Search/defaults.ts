import type { ApiQueryParamsAllowedFields, Listing } from 'services/API/types'

// eslint-disable-next-line import/prefer-default-export
export const listingFields: Array<
  keyof Listing | ApiQueryParamsAllowedFields | 'images[0]' // WTF ???
> = [
  'boardId',
  'mlsNumber',
  'map',
  'class',
  'status',
  'listPrice',
  'listDate',
  'soldPrice',
  'soldDate',
  'updatedOn',
  'address',
  'lastStatus',
  'details.numBathrooms',
  'details.numBathroomsPlus',
  'details.numBedrooms',
  'details.numBedroomsPlus',
  'details.propertyType',
  'details.sqft',
  'lot',
  'images[0]'
  // 'imagesScore',
  // 'details.style'
]
