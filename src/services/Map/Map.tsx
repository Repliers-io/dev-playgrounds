import { type MouseEvent } from 'react'
import { createRoot } from 'react-dom/client'
import {
  type Feature,
  type MultiPolygon,
  type Polygon,
  type Position
} from 'geojson'
import { type LngLatLike, type Map, Marker as MapboxMarker } from 'mapbox-gl'

import { lighten } from '@mui/material'

import Marker, { type MarkerProps } from 'components/Map/components/Marker'

import { type ApiCluster } from 'services/API/types'
import { type Markers } from 'services/Map'
import {
  getBoundaryCenter,
  getLocationName,
  getMapUrl,
  getMarkerName,
  toMapboxBounds,
  toMapboxPoint
} from 'utils/map'

export const polygonColor = '#6633FF'

export const polygonFillOpacity = 0.25
// stacked parcels share one polygon, a denser fill marks them apart
export const stackedPolygonFillOpacity = 0.5
export const polygonFocusColor = '#ff9800'

export class MapService {
  markers: Markers = {}
  clusters: Markers = {}

  // rendered stack size per marker id, so a changed count redraws its badge
  stackCounts: Record<string, number> = {}

  // count badges keyed by their polygon id, so focus can repaint them in step
  stackBadges: Record<string, MapboxMarker> = {}

  hoverStack: Set<string> = new Set()

  createMarkerElement = ({ ...props }: MarkerProps) => {
    const element = <Marker {...props} />

    const container = document.createElement('div')
    const root = createRoot(container)
    root.render(element)

    return container
  }

  showMarkers({
    map,
    items,
    onClick
  }: {
    map: Map
    items: any[]
    onClick?: (item: any) => void
  }): void {
    items.forEach((item) => {
      const { id, status } = item

      const lng = Number(item.map?.longitude)
      const lat = Number(item.map?.latitude)
      const hasValidCenter = Number.isFinite(lng) && Number.isFinite(lat)
      const center = hasValidCenter ? ({ lng, lat } as LngLatLike) : null

      const stackCount = item.stackCount || 1
      const singleViewOnMap = this.markers[id]
      if (singleViewOnMap) {
        // markers are write-once, except when the stack behind one changed size
        if (this.stackCounts[id] === stackCount) return
        this.removeMarkers([id])
      }

      const { boundary, geometryType = 'Polygon' } = (item.map as any) || {}
      if (boundary?.length) {
        this.showBoundary({ id, map, boundary, geometryType, item, onClick })
      } else if (center) {
        this.showMarker({ map, center, item, status, onClick })
      } else {
        console.error('Skipping location with invalid coordinates:', {
          id: item.id,
          longitude: item.map?.longitude,
          latitude: item.map?.latitude,
          item
        })
      }
    })

    // Clearing Marker Residues
    const markersToRemove = Object.keys(this.markers).filter(
      (key) => !items.some((prop) => prop.id === key)
    )
    this.removeMarkers(markersToRemove)
  }

  private showBoundary({
    id,
    map,
    boundary,
    geometryType,
    item,
    onClick
  }: {
    id: string
    map: Map
    boundary: Position[][] | Position[][][]
    geometryType: 'Polygon' | 'MultiPolygon'
    item: any
    onClick?: (item: any) => void
  }) {
    this.createPolygon({
      id,
      map,
      coordinates: boundary,
      geometryType,
      stackCount: item.stackCount,
      onClick: () => onClick?.(item)
    })
  }

  private showMarker({
    map,
    center,
    item,
    status,
    onClick
  }: {
    map: Map
    center: LngLatLike
    item: any
    status: string
    onClick?: (item: any) => void
  }) {
    const isLocation = item.size === 'location'
    const id = isLocation ? getLocationName(item) : getMarkerName(item)
    const markerElement = this.createMarkerElement({
      id,
      status,
      size: item.size || 'point',
      ...(isLocation && { className: 'location' }),
      onClick: (e: MouseEvent) => {
        e.preventDefault()
        onClick?.(item)
      }
    })

    const marker = new MapboxMarker(markerElement).setLngLat(center).addTo(map)

    this.addMarker(id, marker)
  }

  addMarker(key: string, marker: MapboxMarker) {
    if (!this.markers[key]) {
      this.markers[key] = marker
      this.stackCounts[key] = 1
    }
  }

  removeMarkers(keys: string[]) {
    const markers = { ...this.markers }
    keys.forEach((key) => {
      if (this.markers[key]) {
        this.markers[key].remove()
      }
      delete markers[key]
      delete this.stackCounts[key]
    })
    this.markers = { ...markers }
  }

  private getClusterKey(cluster: ApiCluster): string {
    return `c-${cluster.count}-lat-${cluster.location.latitude}-lng-${cluster.location.longitude}`
  }

  // Clustering
  showClusters({ map, clusters }: { map: Map; clusters: ApiCluster[] }): void {
    this.smartResetClusters(clusters)

    clusters.forEach((cluster) => {
      if (this.clusters[this.getClusterKey(cluster)]) return

      const { bounds, location } = cluster
      const center = toMapboxPoint(location)
      const zoom = map.getZoom()

      const mapboxBounds = toMapboxBounds(bounds)
      const markerElement = this.createMarkerElement({
        size: 'cluster',
        link: getMapUrl(center, zoom),
        label: cluster.count.toString(),
        onClick: (e) => {
          map.fitBounds(mapboxBounds)
          e.preventDefault()
        }
      })

      const marker = new MapboxMarker(markerElement)
        .setLngLat(center)
        .addTo(map)

      const key = this.getClusterKey(cluster)
      if (!this.clusters[key]) this.clusters[key] = marker
    })
  }

  removePolygon(map: Map, markerId: string): void {
    try {
      map.removeLayer(`${markerId}-fill`)
      map.removeLayer(`${markerId}-outline`)
      map.removeSource(markerId)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // TODO: not sure we need to handle this error. Mapbox cant control its own sources
    }
  }

  createPolygon({
    map,
    id,
    coordinates,
    geometryType,
    stackCount = 1,
    onClick
  }: {
    map: Map
    id: string
    coordinates: Position[][] | Position[][][]
    geometryType: 'Polygon' | 'MultiPolygon'
    stackCount?: number
    onClick?: () => void
  }): void {
    try {
      const stacked = stackCount > 1
      const geometry: Polygon | MultiPolygon =
        geometryType === 'Polygon'
          ? { type: 'Polygon', coordinates: coordinates as Position[][] }
          : { type: 'MultiPolygon', coordinates: coordinates as Position[][][] }

      const polygonGeoJSON: Feature = {
        type: 'Feature',
        geometry,
        properties: {}
      }

      map.addSource(id, {
        type: 'geojson',
        data: polygonGeoJSON
      })

      const markerFillId = `${id}-fill`
      const markerOutlineId = `${id}-outline`

      map.addLayer({
        id: markerFillId,
        type: 'fill',
        source: id,
        paint: {
          'fill-color': polygonColor,
          'fill-opacity': stacked
            ? stackedPolygonFillOpacity
            : polygonFillOpacity,
          'fill-color-transition': { duration: 0 },
          'fill-opacity-transition': { duration: 0 }
        }
      })

      map.addLayer({
        id: markerOutlineId,
        type: 'line',
        source: id,
        paint: {
          'line-color': lighten(polygonColor, 0.2),
          'line-width': 1.5,
          'line-color-transition': { duration: 0 },
          'line-width-transition': { duration: 0 }
        }
      })

      map.on('click', markerFillId, () => {
        onClick?.()
      })

      map.on('mouseleave', markerFillId, () => {
        this.hoverStack.delete(markerFillId)
        if (this.hoverStack.size === 0) map.getCanvas().style.cursor = ''
      })

      map.on('mouseenter', markerFillId, () => {
        map.getCanvas().style.cursor = 'pointer'
        this.hoverStack.add(markerFillId)
      })

      const badge = stacked
        ? this.createStackBadge({
            map,
            coordinates,
            geometryType,
            stackCount,
            onClick
          })
        : null

      if (badge) this.stackBadges[id] = badge

      this.markers[id] = {
        remove: () => {
          badge?.remove()
          delete this.stackBadges[id]
          this.removePolygon(map, id)
          return this.markers[id]
        }
      } as MapboxMarker
      this.stackCounts[id] = stackCount
    } catch (error) {
      console.error('Error creating polygon:', error)
    }
  }

  /**
   * Count badge for a polygon shared by several locations. It carries no DOM id
   * on purpose: the focus effect falls back to highlighting the polygon only
   * when getElementById finds nothing for the focused marker.
   */
  private createStackBadge({
    map,
    coordinates,
    geometryType,
    stackCount,
    onClick
  }: {
    map: Map
    coordinates: Position[][] | Position[][][]
    geometryType: 'Polygon' | 'MultiPolygon'
    stackCount: number
    onClick?: () => void
  }): MapboxMarker | null {
    const center = getBoundaryCenter(coordinates, geometryType)
    if (!center) return null

    const element = this.createMarkerElement({
      size: 'cluster',
      color: polygonColor,
      borderless: true,
      label: String(stackCount),
      onClick: (e) => {
        e.preventDefault()
        onClick?.()
      }
    })

    return new MapboxMarker(element).setLngLat(center).addTo(map)
  }

  // a polygon can be redrawn or dropped between focus and blur, so a missing
  // layer is an expected outcome here rather than something worth reporting
  private hasPolygonLayers(map: Map, id: string) {
    return Boolean(map.getLayer(`${id}-fill`) && map.getLayer(`${id}-outline`))
  }

  // the badge sits on top of its polygon, so it follows the same paint
  private paintStackBadge(id: string, color: string | null) {
    const element = this.stackBadges[id]?.getElement()
    if (!element) return
    if (color) element.style.setProperty('--marker-bg', color)
    else element.style.removeProperty('--marker-bg')
  }

  focusPolygon(map: Map, id: string) {
    const fill = `${id}-fill`
    const outline = `${id}-outline`
    if (!this.hasPolygonLayers(map, id)) return
    try {
      map.setPaintProperty(fill, 'fill-color', polygonFocusColor)
      map.setPaintProperty(outline, 'line-color', polygonFocusColor)
      this.paintStackBadge(id, polygonFocusColor)
    } catch (error) {
      console.error('Error focusing polygon:', error)
    }
  }

  blurPolygon(map: Map, id: string) {
    const fill = `${id}-fill`
    const outline = `${id}-outline`
    if (!this.hasPolygonLayers(map, id)) return
    try {
      map.setPaintProperty(fill, 'fill-color', polygonColor)
      map.setPaintProperty(outline, 'line-color', lighten(polygonColor, 0.2))
      map.setPaintProperty(outline, 'line-width', 1.5)
      this.paintStackBadge(id, null)
    } catch (error) {
      console.error('Error blurring polygon:', error)
    }
  }

  resetMarkers() {
    const markers = Object.values(this.markers)
    markers.forEach((marker) => marker.remove())
    this.markers = {}
    this.stackCounts = {}
    this.stackBadges = {}
  }

  resetClusters() {
    const clusters: MapboxMarker[] = Object.values(this.clusters)
    clusters.forEach((cluster) => cluster.remove())
    this.clusters = {}
  }

  resetAllMarkers() {
    this.resetMarkers()
    this.resetClusters()
  }

  smartResetClusters(clusters: ApiCluster[]) {
    const newClusterKeys = clusters.map((cluster) =>
      this.getClusterKey(cluster)
    )
    const renderedClusterKeys = Object.keys(this.clusters)

    renderedClusterKeys.forEach((key) => {
      if (!newClusterKeys.includes(key)) {
        this.clusters[key].remove()
        delete this.clusters[key]
      }
    })
  }
}

const mapServiceInstance = new MapService()
export default mapServiceInstance
