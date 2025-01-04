import type { LngLatBounds } from 'mapbox-gl'

import type { ApiLocation, Property } from 'services/API/types'

import { mapboxDefaults } from '../../constants/map'
import { calcZoomLevelForBounds, getPolygonBounds } from '../../utils/map'

export const formatMultiselectFields = (
  parsed: any,
  fields: readonly string[]
) => {
  fields.forEach((field) => {
    const value = parsed[field]
    parsed[field] = !value ? [] : Array.isArray(value) ? value : [value]
  })
  return parsed
}

export const formatBooleanFields = (parsed: any) => {
  if (!parsed || typeof parsed !== 'object') return parsed

  const clone = { ...parsed }

  Object.keys(clone).forEach((key) => {
    const value = clone[key]
    if (value === 'true') {
      clone[key] = true
    } else if (value === 'false') {
      clone[key] = false
    }
  })

  return clone
}

export const getLocations = (listings: Property[]) => {
  /** filter out garbage coordinates and make sure we stay in western & northern hemishperes */
  return listings
    .map((item: Property) => ({
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
