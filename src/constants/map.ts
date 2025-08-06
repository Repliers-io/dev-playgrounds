import { type MapOptions } from 'mapbox-gl'

import mapStyles, { type MapStyle } from 'constants/map-styles'

export { type MapStyle, mapStyles }

export const mapboxToken = import.meta.env.VITE_MAPBOX_KEY || ''

export const defaultAreaZoom = 13
export const fallbackAreaZoom = 11
export const defaultAddressZoom = 15
export const propertyPageAddressZoom = 18

// export const markersBoundsAreaExtension = 0.1 // +10%
export const markersClusteringThreshold = 100

export const mapboxDefaults: Partial<MapOptions> = {
  zoom: 8,
  minZoom: 4,
  maxZoom: 18,
  dragRotate: false,
  doubleClickZoom: true,
  attributionControl: false,
  logoPosition: 'bottom-left',
  accessToken: mapboxToken
}

export const defaultPolygon = [
  { lat: 43.750329, lng: -79.640391 },
  { lat: 43.85459, lng: -79.169572 },
  { lat: 43.717762, lng: -79.09925 },
  { lat: 43.579771, lng: -79.540348 }
]

export const proximitySearchCountry = 'CA'
export const proximitySearchLanguage = 'en'
export const proximitySearchMaxResults = 10
export const proximitySearchCenter = { lat: 43.6532, lng: -79.3832 }
