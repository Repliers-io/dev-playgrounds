import { type Feature, type Point, type Position } from 'geojson'
import mapboxgl, { type LngLat, type LngLatBounds } from 'mapbox-gl'
import { type Map as MapboxMap } from 'mapbox-gl'

import { lighten } from '@mui/material'

import {
  type ApiBounds,
  type ApiCoords,
  type ApiLocation,
  type Listing
} from 'services/API/types'
import { type MapPosition } from 'services/Map/types'
import { toSafeNumber } from 'utils/formatters'
import { getBoundaryBbox } from 'utils/locationView'
import { info } from 'constants/colors'
import { secondary } from 'constants/colors'
import {
  defaultPolygon,
  mapboxDefaults,
  type MapStyle,
  mapStyles
} from 'constants/map'

type Polygon = Array<ApiLocation>

/**
 * @description Function to convert custom polygon object from 'constants/map' module to mapbox bounds
 */
export const getPolygonBounds = (polygon: Polygon) => {
  const { tl, br } = polygon.reduce(
    (acc: any, point: any) => {
      acc.tl.lat = Math.max(acc.tl.lat, point.lat)
      acc.tl.lng = Math.min(acc.tl.lng, point.lng)
      acc.br.lat = Math.min(acc.br.lat, point.lat)
      acc.br.lng = Math.max(acc.br.lng, point.lng)
      return acc
    },
    {
      tl: { lat: -Infinity, lng: Infinity },
      br: { lat: Infinity, lng: -Infinity }
    }
  )

  return new mapboxgl.LngLatBounds(tl, br)
}

export const getPositionBounds = (polygon: Position[]) => {
  return getPolygonBounds(polygon.map(([lng, lat]) => ({ lng, lat })))
}

export const getDefaultBounds = () => {
  return getPolygonBounds(defaultPolygon)
}

export const getZoom = (searchParams: URLSearchParams) =>
  toSafeNumber(searchParams.get('z')) || mapboxDefaults.zoom!

export const getCoords = (searchParams: URLSearchParams) => {
  const firstParam = searchParams.keys().next().value || ''
  const matches = firstParam.match(/([-0-9.]+),([-0-9.]+)/)
  const [, lat, lng] = matches || [0, 0, 0]

  if (!lat || !lng) return null

  return new mapboxgl.LngLat(toSafeNumber(lng), toSafeNumber(lat))
}

export const roundCoord = (coord: number | string) => Number(coord).toFixed(6)

export const getMapStyleUrl = (style: MapStyle) =>
  `mapbox://styles/mapbox/${mapStyles[style]}`

export const getStaticMapStyleUrl = (style: MapStyle) =>
  `https://api.mapbox.com/styles/v1/mapbox/${mapStyles[style]}/static`

export const getStaticMarker = (
  longitude: string,
  latitude: string,
  symbol = 'home'
) => {
  const markerSize = 'l'
  const markerColor = secondary.replace('#', '')
  return `pin-${markerSize}-${symbol}+${markerColor}(${longitude},${latitude})`
}

export const getMapUrl = (center: LngLat, zoom: number) => {
  const { lat, lng } = center
  return `?${roundCoord(lat)},${roundCoord(lng)}&z=${String(zoom).slice(0, 8)}`
}

export const setMapUrl = (center: LngLat, zoom: number) => {
  const url = getMapUrl(center, zoom)
  // TODO: investigate why do we need a direct `history.pushState`
  // instead of router.push
  window.history.pushState(null, '', url)
}

export const getMarkerName = (listing: Listing) =>
  `marker-${listing.mlsNumber}-${listing.boardId}`

export const getLocationName = (location: any) =>
  `location-${location.locationId}-${location.map?.boundary?.[0]?.length || 0}`

/**
 * Center of a boundary's bounding box, used to place the stack count badge.
 * Parcels are near-rectangular, so the bbox center sits inside the shape and
 * costs a single pass over the coordinates.
 */
export const getBoundaryCenter = (
  boundary: Position[][] | Position[][][],
  geometryType: 'Polygon' | 'MultiPolygon' = 'Polygon'
): LngLat | null => {
  const bbox = getBoundaryBbox(boundary, geometryType)
  if (!bbox) return null
  const [minLng, minLat, maxLng, maxLat] = bbox
  return new mapboxgl.LngLat((minLng + maxLng) / 2, (minLat + maxLat) / 2)
}

export const toMapboxPoint = (location: ApiCoords) => {
  const { latitude, longitude } = location
  return new mapboxgl.LngLat(longitude, latitude)
}

export const toApiPoint = (point: Point): ApiCoords => {
  const [longitude, latitude] = point.coordinates
  return { longitude, latitude }
}

export const toMapboxBounds = (bounds: ApiBounds, buffer = 0) => {
  const { top_left, bottom_right } = bounds

  return new mapboxgl.LngLatBounds(
    // converting mixed top_left coords to northeast (mapbox._NE)
    [top_left.longitude - buffer, bottom_right.latitude + buffer],
    // and mixed bottom_right to southwest (mapbox._SW)
    [bottom_right.longitude + buffer, top_left.latitude - buffer]
  )
}

export const toApiBounds = (bounds: LngLatBounds): ApiBounds => {
  const sw = bounds.getSouthWest()
  const ne = bounds.getNorthEast()

  return {
    top_left: { latitude: ne.lat, longitude: sw.lng },
    bottom_right: { latitude: sw.lat, longitude: ne.lng }
  }
}

export const toRectangle = (
  bounds: LngLatBounds,
  buffer = 0,
  { closed = false }: { closed?: boolean } = {}
) => {
  /*
    map = [ ↗ NorthEast, ↖ NorthWest, ↙ SouthWest, ↘ SouthEast]
  */
  const nw = bounds.getNorthWest().wrap()
  const sw = bounds.getSouthWest().wrap()

  const ne = bounds.getNorthEast().wrap()
  const se = bounds.getSouthEast().wrap()

  // TODO: looks like buffer paddings are not set correctly
  const rectangle = [
    `[${ne.lng + buffer},${ne.lat + buffer}]`, // ↗
    `[${nw.lng - buffer},${nw.lat + buffer}]`, // ↖
    `[${sw.lng - buffer},${sw.lat - buffer}]`, // ↙
    `[${se.lng + buffer},${se.lat - buffer}]` //  ↘
  ]

  // the /locations spec requires a closed ring, the listings endpoint does not
  if (closed) rectangle.push(rectangle[0])

  return `[[${rectangle.join(',')}]]`
}

export const getCenter = (bounds: ApiBounds) => {
  const { top_left, bottom_right } = bounds

  return new mapboxgl.LngLat(
    (top_left.longitude + bottom_right.longitude) / 2,
    (top_left.latitude + bottom_right.latitude) / 2
  )
}

export const getLngLatCenter = (bounds: LngLatBounds) =>
  getCenter(toApiBounds(bounds))

export const calcZoomLevel = (
  map: mapboxgl.Map,
  apiBounds: ApiBounds
): number => {
  const bounds = toMapboxBounds(apiBounds)
  const viewportWidth = map.getContainer().clientWidth
  const viewportHeight = map.getContainer().clientHeight

  const maxZoom = map.getMaxZoom()
  const minZoom = map.getMinZoom()

  const northeast = map.project(bounds.getNorthEast())
  const southwest = map.project(bounds.getSouthWest())

  const width = Math.abs(northeast.x - southwest.x)
  const height = Math.abs(southwest.y - northeast.y)

  const scaleWidth = viewportWidth / width
  const scaleHeight = viewportHeight / height
  const scale = Math.min(scaleWidth, scaleHeight)
  const zoom = Math.log2(scale) + map.getZoom()

  return Math.max(minZoom, Math.min(maxZoom, zoom))
}

export const calcZoomLevelForBounds = (
  bounds: LngLatBounds,
  width: number,
  height: number
) => {
  const dx = Math.abs(bounds.getEast() - bounds.getWest()) // longitude
  const dy = Math.abs(bounds.getSouth() - bounds.getNorth()) // latitude

  const zoomWidth = Math.log2((width * 180) / (dx * 256))
  const zoomHeight = Math.log2((height * 180) / (dy * 256))
  return Math.min(zoomWidth, zoomHeight)
}

/**
 * The viewport a `width` x `height` pixel Mapbox map shows at `center` and
 * `zoom`, for when the map itself cannot be created, e.g. its container is
 * hidden. Mapbox GL renders 512px tiles, hence the `zoom + 1`.
 */
export const estimateBoundsAtZoom = (
  center: LngLat,
  zoom: number,
  width: number,
  height: number
): LngLatBounds => {
  const EARTH_RADIUS = 6378137 // in meters
  const latRad = (center.lat * Math.PI) / 180

  const metersPerPixel =
    (2 * Math.PI * EARTH_RADIUS * Math.cos(latRad)) / (256 * 2 ** (zoom + 1))

  const latDiff = ((height * metersPerPixel) / EARTH_RADIUS) * (180 / Math.PI)
  const lngDiff =
    (((width * metersPerPixel) / EARTH_RADIUS) * (180 / Math.PI)) /
    Math.cos(latRad)

  return new mapboxgl.LngLatBounds(
    [center.lng - lngDiff / 2, center.lat - latDiff / 2],
    [center.lng + lngDiff / 2, center.lat + latDiff / 2]
  )
}

/**
 * Size of `element`, or of the nearest ancestor that is laid out when the
 * element sits inside a `display: none` subtree and measures 0 x 0.
 */
export const getLaidOutSize = (element: HTMLElement | null) => {
  let node: HTMLElement | null = element
  while (node) {
    const { clientWidth, clientHeight } = node
    if (clientWidth > 0 && clientHeight > 0) {
      return { width: clientWidth, height: clientHeight }
    }
    node = node.parentElement
  }
  return { width: window.innerWidth, height: window.innerHeight }
}

export const removePolygon = (map: MapboxMap) => {
  try {
    map.removeLayer('polygon-fill')
    map.removeLayer('polygon-outline')
    map.removeSource('polygon')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // TODO: not sure we need to handle this error. Mapbox cant control its own sources
  }
}

export const addPolygon = (map: MapboxMap, polygon: Position[]) => {
  if (polygon) {
    const polygonGeoJSON: Feature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [polygon]
      },
      properties: {}
    }

    map.addSource('polygon', {
      type: 'geojson',
      data: polygonGeoJSON
    })

    map.addLayer({
      id: 'polygon-fill',
      type: 'fill',
      source: 'polygon',
      paint: {
        'fill-color': info,
        'fill-opacity': 0.25
      }
    })

    map.addLayer({
      id: 'polygon-outline',
      type: 'line',
      source: 'polygon',
      paint: {
        'line-color': lighten(info, 0.2),
        'line-width': 1.5
      }
    })
  }
}

export const updateMapboxPosition = (
  map: MapboxMap | null,
  position: MapPosition
) => {
  const { center, zoom, bounds } = position

  if (!map || !center || !bounds) return

  map.setCenter(center)
  map.setZoom(zoom)
  map.fitBounds(bounds, { animate: true })
}

export const getLocations = (listings: Listing[]) => {
  /** filter out garbage coordinates and make sure we stay in western & northern hemishperes */
  return (listings || [])
    .map((item: Listing) => ({
      lat: parseFloat(item.map.latitude),
      lng: parseFloat(item.map.longitude)
    }))
    .filter(({ lat, lng }) => lat > 0 && lng < 0)
}

export const getMapContainerSize = (container: HTMLElement | null) => {
  return container
    ? { width: container.clientWidth, height: container.clientHeight }
    : null
}

export const getMapZoom = (
  bounds: LngLatBounds,
  container: HTMLElement | null
) => {
  const size = getMapContainerSize(container)
  return size
    ? calcZoomLevelForBounds(bounds, size.width, size.height)
    : mapboxDefaults.zoom!
}

export const getMapPosition = (
  locations: ApiLocation[],
  container: HTMLElement | null
) => {
  const bounds = getPolygonBounds(locations)
  const center = bounds.getCenter()
  const zoom = getMapZoom(bounds, container)
  return { bounds, center, zoom }
}
