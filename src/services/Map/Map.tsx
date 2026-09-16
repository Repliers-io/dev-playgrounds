import { type MouseEvent } from 'react'
import { createRoot } from 'react-dom/client'
import {
  type Feature,
  type MultiPolygon,
  type Polygon,
  type Position
} from 'geojson'
import {
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
// stacked parcels share one polygon, a denser fill marks them apart
export const stackedPolygonFillOpacity = 0.5
export const polygonFocusColor = '#ff9800'

export class MapService {
  markers: Markers = {}
  clusters: Markers = {}

  // signature of what each marker id currently draws, so a changed stack size
  // or a changed geometry redraws it even though the id stayed the same
  renderKeys: Record<string, string> = {}

  // count badges keyed by their polygon id, so focus can repaint them in step
  stackBadges: Record<string, MapboxMarker> = {}

  // click handler per polygon fill layer. Mapbox runs a separate hit test for
  // every layer-scoped listener, so hundreds of polygons get two delegated
  // listeners on the map and one hit test instead
  private polygonHandlers: Record<string, () => void> = {}
  private polygonLayerIds: string[] = []
  private polygonLayersDirty = true
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
    items.forEach((item) => {
      const { id, status } = item

      const lng = Number(item.map?.longitude)
      const lat = Number(item.map?.latitude)
      const hasValidCenter = Number.isFinite(lng) && Number.isFinite(lat)
      const center = hasValidCenter ? ({ lng, lat } as LngLatLike) : null

      const renderKey = `${item.stackCount || 1}:${item.renderKey ?? ''}`
      const singleViewOnMap = this.markers[id]
      if (singleViewOnMap) {
        // markers are write-once, except when what they draw actually changed
        if (this.renderKeys[id] === renderKey) return
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
        return
      }

      this.renderKeys[id] = renderKey
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
    }
  }

  removeMarkers(keys: string[]) {
    const markers = { ...this.markers }
    keys.forEach((key) => {
      if (this.markers[key]) {
        this.markers[key].remove()
      }
      delete markers[key]
      delete this.renderKeys[key]
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
      const layerId = this.queryPolygonLayer(map, event.point)
      if (layerId) this.polygonHandlers[layerId]?.()
    })

    map.on('mousemove', (event) => {
      // one hit test per frame is plenty for a cursor change
      if (this.hoverScheduled) return
      this.hoverScheduled = true

      requestAnimationFrame(() => {
        this.hoverScheduled = false
        const hovered = Boolean(this.queryPolygonLayer(map, event.point))
        if (hovered === this.pointerCursor) return
        this.pointerCursor = hovered
        map.getCanvas().style.cursor = hovered ? 'pointer' : ''
      })
    })
  }

  /** Topmost polygon fill layer under a screen point, if any. */
  private queryPolygonLayer(map: Map, point: PointLike): string | null {
    if (this.polygonLayersDirty) {
      this.polygonLayerIds = Object.keys(this.polygonHandlers)
      this.polygonLayersDirty = false
    }
    if (!this.polygonLayerIds.length) return null

    try {
      const [feature] = map.queryRenderedFeatures(point, {
        layers: this.polygonLayerIds
      })
      return feature?.layer?.id || null
      // a style reload can drop layers the registry still lists
    } catch {
      return null
    }
  }

  removePolygon(map: Map, markerId: string): void {
    delete this.polygonHandlers[`${markerId}-fill`]
    this.polygonLayersDirty = true

    try {
      map.removeLayer(`${markerId}-fill`)
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

      // the outline rides on the fill layer instead of its own line layer:
      // halves the layer count and drops line tessellation entirely
      map.addLayer({
        id: markerFillId,
        type: 'fill',
        source: id,
        paint: {
          'fill-color': polygonColor,
          'fill-outline-color': polygonOutlineColor,
          'fill-opacity': stacked
            ? stackedPolygonFillOpacity
            : polygonFillOpacity,
          'fill-color-transition': { duration: 0 },
          'fill-opacity-transition': { duration: 0 },
          'fill-outline-color-transition': { duration: 0 }
        }
      })

      this.polygonHandlers[markerFillId] = () => onClick?.()
      this.polygonLayersDirty = true
      this.bindPolygonEvents(map)

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
    return Boolean(map.getLayer(`${id}-fill`))
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
    if (!this.hasPolygonLayers(map, id)) return
    try {
      map.setPaintProperty(fill, 'fill-color', polygonFocusColor)
      map.setPaintProperty(fill, 'fill-outline-color', polygonFocusColor)
      this.paintStackBadge(id, polygonFocusColor)
    } catch (error) {
      console.error('Error focusing polygon:', error)
    }
  }

  blurPolygon(map: Map, id: string) {
    const fill = `${id}-fill`
    if (!this.hasPolygonLayers(map, id)) return
    try {
      map.setPaintProperty(fill, 'fill-color', polygonColor)
      map.setPaintProperty(fill, 'fill-outline-color', polygonOutlineColor)
      this.paintStackBadge(id, null)
    } catch (error) {
      console.error('Error blurring polygon:', error)
    }
  }

  resetMarkers() {
    const markers = Object.values(this.markers)
    markers.forEach((marker) => marker.remove())
    this.markers = {}
    this.renderKeys = {}
    this.stackBadges = {}
    this.polygonHandlers = {}
    this.polygonLayersDirty = true
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
