import { type Position } from 'geojson'

import { simplify } from '@turf/turf'

const toRad = (deg: number) => deg * (Math.PI / 180)
const toDeg = (rad: number) => rad * (180 / Math.PI)

// a closed ring needs three distinct corners plus the repeated first point
const drawableRing = (ring: Position[]) =>
  Array.isArray(ring) && ring.length > 3

/**
 * Douglas-Peucker simplification of a location boundary, used to cut the vertex
 * count Mapbox has to draw. Tolerance is in degrees, to match WGS84 coordinates.
 *
 * Applied to rendering only: grouping still compares the untouched geometry, and
 * the response panel keeps showing the raw payload. A boundary that collapses
 * below a drawable ring is returned at full detail rather than dropped.
 */
export const simplifyBoundary = (
  boundary: Position[][] | Position[][][],
  geometryType: 'Polygon' | 'MultiPolygon' = 'Polygon',
  tolerance = 0
): Position[][] | Position[][][] => {
  if (!tolerance || tolerance <= 0 || !boundary?.length) return boundary

  try {
    const simplified: any = simplify(
      { type: geometryType, coordinates: boundary } as any,
      { tolerance, highQuality: false, mutate: false }
    )

    const coordinates = simplified?.coordinates
    if (!coordinates?.length) return boundary

    const rings: Position[][] =
      geometryType === 'MultiPolygon'
        ? (coordinates as Position[][][]).flat()
        : (coordinates as Position[][])

    return rings.every(drawableRing) ? coordinates : boundary
  } catch {
    return boundary
  }
}

export const countBoundaryPoints = (
  boundary: Position[][] | Position[][][],
  geometryType: 'Polygon' | 'MultiPolygon' = 'Polygon'
): number => {
  if (!boundary?.length) return 0
  const rings: Position[][] =
    geometryType === 'MultiPolygon'
      ? (boundary as Position[][][]).flat()
      : (boundary as Position[][])
  return rings.reduce((total, ring) => total + (ring?.length || 0), 0)
}

export type Location = { lat: number; lng: number }

export const getHeading = (point1: Location, point2: Location, headX = 0) => {
  const { lat: lat1, lng: lng1 } = point1
  const { lat: lat2, lng: lng2 } = point2
  // Convert latitude and longitude differences to radians
  // const deltaLat = toRad(lat2 - lat1)
  const deltaLon = toRad(lng2 - lng1)

  // Convert initial and final latitudes to radians
  const radLat1 = toRad(lat1)
  const radLat2 = toRad(lat2)

  // Calculate intermediate values for heading/bearing calculation
  const y = Math.sin(deltaLon) * Math.cos(radLat2)
  const x =
    Math.cos(radLat1) * Math.sin(radLat2) -
    Math.sin(radLat1) * Math.cos(radLat2) * Math.cos(deltaLon)

  // Calculate bearing in radians and convert to degrees
  let heading = toDeg(Math.atan2(y, x))

  // Adjust bearing to be in the range of 0 to 360 degrees
  if (heading < 0) {
    heading = 360 + heading
  }

  // Subtract optional heading adjustment and ensure the result is within 0 to 360 degrees
  heading = (heading - headX + 360) % 360
  heading = Number.isFinite(heading) ? heading : 0

  return Math.floor(heading)
}
