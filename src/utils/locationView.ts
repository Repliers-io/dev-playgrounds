import { type Position } from 'geojson'

/** Share of the visible map a location takes up after "center on it". */
export const locationFitShare = 0.5

/** Zoom kept by the old "center" button, and used for types not listed. */
export const defaultLocationZoom = 10

/**
 * Fixed zoom steps for locations that come without a boundary and can only be
 * shown as a point, keyed by the API's LocationType.
 */
export const locationTypeZoom: Record<string, number> = {
  area: 9,
  schoolDistrict: 10,
  city: 11,
  'city-alternate': 11,
  district: 12,
  neighborhood: 13,
  'neighborhood-alternate': 13,
  postalCode: 13,
  school: 14,
  property: 16
}

export const getLocationZoom = (type?: string) =>
  (type && locationTypeZoom[type]) || defaultLocationZoom

/**
 * `[west, south, east, north]` of a location boundary, `null` when it holds
 * no finite point. Mapbox takes the tuple as `LngLatBoundsLike` directly.
 */
export const getBoundaryBbox = (
  boundary: Position[][] | Position[][][] | undefined,
  geometryType: 'Polygon' | 'MultiPolygon' = 'Polygon'
): [number, number, number, number] | null => {
  if (!boundary?.length) return null

  const rings =
    geometryType === 'MultiPolygon'
      ? (boundary as Position[][][]).flat()
      : (boundary as Position[][])

  let minLng = Infinity
  let maxLng = -Infinity
  let minLat = Infinity
  let maxLat = -Infinity

  rings.forEach((ring) => {
    ring?.forEach(([lng, lat]) => {
      if (!Number.isFinite(lng) || !Number.isFinite(lat)) return
      if (lng < minLng) minLng = lng
      if (lng > maxLng) maxLng = lng
      if (lat < minLat) minLat = lat
      if (lat > maxLat) maxLat = lat
    })
  })

  if (!Number.isFinite(minLng) || !Number.isFinite(minLat)) return null

  return [minLng, minLat, maxLng, maxLat]
}

/**
 * Mapbox `fitBounds` padding that leaves the fitted bounds `share` of the view
 * on each axis, centered on the whole map.
 */
export const getFitPadding = (
  { width, height }: { width: number; height: number },
  share: number
) => {
  const padX = (width * (1 - share)) / 2
  const padY = (height * (1 - share)) / 2
  return { top: padY, right: padX, bottom: padY, left: padX }
}
