import type { ApiQueryParamsAllowedFields, Listing } from 'services/API/types'

// eslint-disable-next-line import/prefer-default-export
export const listingFields: Array<keyof Listing | ApiQueryParamsAllowedFields> =
  [
    'mlsNumber',
    'status',
    'class',
    'listPrice',
    'listDate',
    // 'lastStatus',
    'soldPrice',
    'soldDate',
    'address',
    'map',
    'images',
    // 'imagesScore',
    'details.numBathrooms',
    'details.numBathroomsPlus',
    'details.numBedrooms',
    'details.numBedroomsPlus',
    'details.propertyType',
    'details.sqft',
    'details.style',
    // 'lot',
    'updatedOn',
    // 'daysOnMarket',
    'boardId'
  ]
