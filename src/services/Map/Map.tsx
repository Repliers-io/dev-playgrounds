import { type MouseEvent } from 'react'
import { createRoot } from 'react-dom/client'
import {
  type Feature,
  type FeatureCollection,
  type MultiPolygon,
  type Polygon,
  type Position
} from 'geojson'
import {
  type GeoJSONSource,
  type LngLatLike,
  type Map,
  Marker as MapboxMarker,
  type PointLike
} from 'mapbox-gl'

import { darken } from '@mui/material'

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
// `fill-opacity` multiplies the 1px fill outline too, so it has to start out
// darker than the fill to stay legible once alpha is applied
export const polygonOutlineColor = darken(polygonColor, 0.35)

export const polygonFillOpacity = 0.25
// stacked parcels share one polygon: a near-solid fill both marks them apart
// and gives the plain white count on top something to read against
export const stackedPolygonFillOpacity = 0.75
export const polygonFocusColor = '#ff9800'

// every boundary lives in this one source and is drawn by this one layer,
// so the cost of adding a polygon no longer scales with draw calls or tile
// indexes. Focus rides on feature-state, which the GPU resolves per feature.
const polygonSourceId = 'locations-boundaries'
const polygonLayerId = 'locations-boundaries-fill'

const focusedCase = (focused: string, idle: string) => [
  'case',
  ['boolean', ['feature-state', 'focused'], false],
  focused,
  idle
]

export class MapService {
  markers: Markers = {}
  clusters: Markers = {}

  // count badges keyed by their polygon id, so focus can repaint them in step
  stackBadges: Record<string, MapboxMarker> = {}
  private badgeKeys: Record<string, string> = {}

  // boundary items by marker id, so a hit test can report what was clicked
  private polygonItems: Record<string, any> = {}
  private polygonOnClick?: (item: any) => void

  private eventsBoundTo: Map | null = null
  private hoverScheduled = false
  private pointerCursor = false

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
    const boundaryItems: any[] = []
    const pointItems: any[] = []

    items.forEach((item) => {
      if (item.map?.boundary?.length) {
        boundaryItems.push(item)
        return
      }

      const lng = Number(item.map?.longitude)
      const lat = Number(item.map?.latitude)
      if (Number.isFinite(lng) && Number.isFinite(lat)) {
        pointItems.push(item)
        return
      }

      console.error('Skipping location with invalid coordinates:', {
        id: item.id,
        longitude: item.map?.longitude,
        latitude: item.map?.latitude,
        item
      })
    })

    this.syncPolygons({ map, items: boundaryItems, onClick })

    pointItems.forEach((item) => {
      // DOM markers stay write-once, nothing about them changes in place
      if (this.markers[item.id]) return
      const lng = Number(item.map.longitude)
      const lat = Number(item.map.latitude)
      this.showMarker({
        map,
        center: { lng, lat } as LngLatLike,
        item,
        status: item.status,
        onClick
      })
    })

    // Clearing Marker Residues
    const markersToRemove = Object.keys(this.markers).filter(
      (key) => !pointItems.some((item) => item.id === key)
    )
    this.removeMarkers(markersToRemove)
  }

  /**
   * Replaces every rendered boundary in one `setData` call. The source and its
   * layer are created once and then reused for the life of the map.
   */
  private syncPolygons({
    map,
    items,
    onClick
  }: {
    map: Map
    items: any[]
    onClick?: (item: any) => void
  }) {
    this.polygonOnClick = onClick
    this.polygonItems = {}

    const features: Feature[] = items.map((item) => {
      const { boundary, geometryType = 'Polygon' } = item.map
      const geometry: Polygon | MultiPolygon =
        geometryType === 'Polygon'
          ? { type: 'Polygon', coordinates: boundary as Position[][] }
          : { type: 'MultiPolygon', coordinates: boundary as Position[][][] }

      this.polygonItems[item.id] = item

      return {
        type: 'Feature',
        geometry,
        properties: {
          markerId: item.id,
          stacked: (item.stackCount || 1) > 1
        }
      }
    })

    const collection: FeatureCollection = {
      type: 'FeatureCollection',
      features
    }

    try {
      const source = map.getSource(polygonSourceId) as GeoJSONSource | undefined

      if (source) {
        // feature-state is keyed by feature id and would outlive the features
        map.removeFeatureState({ source: polygonSourceId })
        source.setData(collection)
      } else if (features.length) {
        map.addSource(polygonSourceId, {
          type: 'geojson',
          data: collection,
          // lifts `markerId` into `feature.id` so feature-state can address it
          promoteId: 'markerId'
        })

        map.addLayer({
          id: polygonLayerId,
          type: 'fill',
          source: polygonSourceId,
          paint: {
            'fill-color': focusedCase(polygonFocusColor, polygonColor),
            'fill-outline-color': focusedCase(
              polygonFocusColor,
              polygonOutlineColor
            ),
            'fill-opacity': [
              'case',
              ['boolean', ['get', 'stacked'], false],
              stackedPolygonFillOpacity,
              polygonFillOpacity
            ],
            'fill-color-transition': { duration: 0 },
            'fill-opacity-transition': { duration: 0 },
            'fill-outline-color-transition': { duration: 0 }
          }
        } as any)

        this.bindPolygonEvents(map)
      }
    } catch (error) {
      console.error('Error syncing polygons:', error)
    }

    this.syncStackBadges(map, items)
  }

  private removePolygonSource(map: Map) {
    try {
      if (map.getLayer(polygonLayerId)) map.removeLayer(polygonLayerId)
      if (map.getSource(polygonSourceId)) map.removeSource(polygonSourceId)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // Mapbox throws when the style was swapped out from under us
    }
    this.polygonItems = {}
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
    }
  }

  removeMarkers(keys: string[]) {
    const markers = { ...this.markers }
    keys.forEach((key) => {
      if (this.markers[key]) {
        this.markers[key].remove()
      }
      delete markers[key]
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

  /**
   * Two delegated listeners cover every polygon on the map. A layer-scoped
   * `map.on('click', layerId, fn)` costs one hit test per registered layer on
   * each event, which is what made hundreds of polygons expensive to hover.
   */
  private bindPolygonEvents(map: Map) {
    if (this.eventsBoundTo === map) return
    this.eventsBoundTo = map

    map.on('click', (event) => {
      const item = this.queryPolygonItem(map, event.point)
      if (item) this.polygonOnClick?.(item)
    })

    map.on('mousemove', (event) => {
      // one hit test per frame is plenty for a cursor change
      if (this.hoverScheduled) return
      this.hoverScheduled = true

      requestAnimationFrame(() => {
        this.hoverScheduled = false
        const hovered = Boolean(this.queryPolygonItem(map, event.point))
        if (hovered === this.pointerCursor) return
        this.pointerCursor = hovered
        map.getCanvas().style.cursor = hovered ? 'pointer' : ''
      })
    })
  }

  /** Topmost boundary under a screen point, resolved back to its item. */
  private queryPolygonItem(map: Map, point: PointLike): any | null {
    if (!map.getLayer(polygonLayerId)) return null

    try {
      const [feature] = map.queryRenderedFeatures(point, {
        layers: [polygonLayerId]
      })
      const markerId = feature?.properties?.markerId
      return markerId ? this.polygonItems[markerId] || null : null
      // a style reload can drop the layer while the registry still holds items
    } catch {
      return null
    }
  }

  /**
   * Count for a polygon shared by several locations: bare white text with no
   * DOM id and no pointer events, so hover and clicks fall straight through to
   * the polygon underneath and stay on the single delegated hit test.
   */
  private createStackBadge({
    map,
    coordinates,
    geometryType,
    stackCount
  }: {
    map: Map
    coordinates: Position[][] | Position[][][]
    geometryType: 'Polygon' | 'MultiPolygon'
    stackCount: number
  }): MapboxMarker | null {
    const center = getBoundaryCenter(coordinates, geometryType)
    if (!center) return null

    const element = this.createMarkerElement({
      size: 'label',
      label: String(stackCount)
    })
    element.style.pointerEvents = 'none'

    return new MapboxMarker(element).setLngLat(center).addTo(map)
  }

  /** Badges are DOM, so unlike the polygons they are diffed rather than reset. */
  private syncStackBadges(map: Map, items: any[]) {
    const wanted: Record<string, { item: any; key: string }> = {}

    items.forEach((item) => {
      const stackCount = item.stackCount || 1
      if (stackCount < 2) return
      wanted[item.id] = { item, key: `${stackCount}:${item.renderKey ?? ''}` }
    })

    Object.keys(this.stackBadges).forEach((id) => {
      if (wanted[id] && this.badgeKeys[id] === wanted[id].key) return
      this.stackBadges[id].remove()
      delete this.stackBadges[id]
      delete this.badgeKeys[id]
    })

    Object.entries(wanted).forEach(([id, { item, key }]) => {
      if (this.stackBadges[id]) return

      const { boundary, geometryType = 'Polygon' } = item.map
      const badge = this.createStackBadge({
        map,
        coordinates: boundary,
        geometryType,
        stackCount: item.stackCount
      })

      if (badge) {
        this.stackBadges[id] = badge
        this.badgeKeys[id] = key
      }
    })
  }

  focusPolygon(map: Map, id: string) {
    if (!map.getLayer(polygonLayerId)) return
    try {
      map.setFeatureState({ source: polygonSourceId, id }, { focused: true })
    } catch (error) {
      console.error('Error focusing polygon:', error)
    }
  }

  blurPolygon(map: Map, id: string) {
    if (!map.getLayer(polygonLayerId)) return
    try {
      map.removeFeatureState({ source: polygonSourceId, id }, 'focused')
    } catch (error) {
      console.error('Error blurring polygon:', error)
    }
  }

  resetMarkers(map?: Map) {
    const markers = Object.values(this.markers)
    markers.forEach((marker) => marker.remove())
    this.markers = {}

    Object.values(this.stackBadges).forEach((badge) => badge.remove())
    this.stackBadges = {}
    this.badgeKeys = {}

    if (map) this.removePolygonSource(map)
    this.polygonItems = {}
  }

  resetClusters() {
    const clusters: MapboxMarker[] = Object.values(this.clusters)
    clusters.forEach((cluster) => cluster.remove())
    this.clusters = {}
  }

  resetAllMarkers(map?: Map) {
    this.resetMarkers(map)
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
