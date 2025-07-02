import { type MouseEvent } from 'react'
import { createRoot } from 'react-dom/client'
import { type Feature, type Position } from 'geojson'
import { type LngLatLike, type Map, Marker as MapboxMarker } from 'mapbox-gl'

import { lighten } from '@mui/material'

import Marker, { type MarkerProps } from 'components/Map/components/Marker'

import { type ApiCluster } from 'services/API/types'
import { type Markers } from 'services/Map'
import {
  getLocationName,
  getMapUrl,
  getMarkerName,
  toMapboxBounds,
  toMapboxPoint
} from 'utils/map'

export const polygonColor = '#6633FF'

export class MapService {
  markers: Markers = {}
  clusters: Markers = {}

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
    this.resetClusters()

    items.forEach((item) => {
      const { id, status } = item

      const center = item.map
        ? ({
            lng: Number(item.map.longitude),
            lat: Number(item.map.latitude)
          } as LngLatLike)
        : null
      if (!center) return

      const singleViewOnMap = this.markers[id]
      if (singleViewOnMap) return

      const { boundary } = item.map as any
      if (boundary?.length) {
        this.createPolygon({
          id,
          map,
          polygon: boundary,
          onClick: () => onClick?.(item)
        })
      } else {
        const isLocation = item.size === 'location'
        const id = isLocation ? getLocationName(item) : getMarkerName(item)
        const markerElement = this.createMarkerElement({
          id,
          status,
          size: item.size || 'point',
          ...(isLocation && { className: 'location' }),
          onClick: (e: MouseEvent) => {
            // Prevent redirect on click
            e.preventDefault()
            onClick?.(item)
          }
        })

        const marker = new MapboxMarker(markerElement)
          .setLngLat(center)
          .addTo(map)

        this.addMarker(id, marker)
      }
    })

    // Clearing Marker Residues
    const markersToRemove = Object.keys(this.markers).filter(
      (key) => !items.some((prop) => prop.id === key)
    )
    this.removeMarkers(markersToRemove)
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
    this.resetMarkers()
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
    polygon,
    onClick
  }: {
    map: Map
    id: string
    polygon: Position[][]
    onClick?: () => void
  }): void {
    try {
      const polygonGeoJSON: Feature = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: polygon
        },
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
          'fill-opacity': 0.25,
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

      this.markers[id] = {
        remove: () => {
          this.removePolygon(map, id)
          return this.markers[id]
        }
      } as MapboxMarker
    } catch (error) {
      console.error('Error creating polygon:', error)
    }
  }

  focusPolygon(map: Map, id: string) {
    const fill = `${id}-fill`
    const outline = `${id}-outline`
    try {
      map.setPaintProperty(fill, 'fill-color', '#ff9800')
      map.setPaintProperty(outline, 'line-color', '#ff9800')
    } catch (error) {
      console.error('Error focusing polygon:', error)
    }
  }

  blurPolygon(map: Map, id: string) {
    const fill = `${id}-fill`
    const outline = `${id}-outline`
    try {
      map.setPaintProperty(fill, 'fill-color', polygonColor)
      map.setPaintProperty(outline, 'line-color', lighten(polygonColor, 0.2))
      map.setPaintProperty(outline, 'line-width', 1.5)
    } catch (error) {
      console.error('Error blurring polygon:', error)
    }
  }

  resetMarkers() {
    const markers = Object.values(this.markers)
    markers.forEach((marker) => marker.remove())
    this.markers = {}
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
