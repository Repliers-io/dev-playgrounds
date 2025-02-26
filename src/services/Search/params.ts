import type { Position } from 'geojson'
import { type LngLatBounds } from 'mapbox-gl'

import { getDefaultBounds, toRectangle } from 'utils/map'
import { defaultResultsPerPage } from 'constants/search'

import { listingFields } from './defaults'

export const getListingFields = () => ({
  listings: true,
  fields: listingFields.join(',')
})

export const getMapRectangle = (bounds: LngLatBounds) => ({
  map: toRectangle(bounds)
})

export const getDefaultRectangle = () => ({
  map: toRectangle(getDefaultBounds())
})

export const getMapPolygon = (polygon: Position[]) => ({
  map: '[[' + polygon.map((p) => '[' + p.join(',') + ']').join(',') + ']]'
})

export const getPageParams = (pageNum: number = 1) => ({
  pageNum,
  resultsPerPage: defaultResultsPerPage
})
