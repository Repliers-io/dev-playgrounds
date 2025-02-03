import type { LngLatBounds } from 'mapbox-gl'

import type {
  ApiLocation,
  Listing,
  ParamsPanelControls
} from 'services/API/types'
import type { FormParams } from 'providers/SearchProvider'
import { calcZoomLevelForBounds, getPolygonBounds } from 'utils/map'
import { mapboxDefaults } from 'constants/map'

export const getLocations = (listings: Listing[]) => {
  /** filter out garbage coordinates and make sure we stay in western & northern hemishperes */
  return listings
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

export const filterBlockedFormParams = (
  blockedKeys: (keyof ParamsPanelControls)[],
  params: Partial<FormParams> = {}
) => {
  return Object.keys(params).reduce((acc, key) => {
    if (!blockedKeys.includes(key as keyof ParamsPanelControls)) {
      acc[key] = params[key]
    }
    return acc
  }, {} as Partial<FormParams>)
}
