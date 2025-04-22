import { type MouseEvent } from 'react'
import { createRoot } from 'react-dom/client'
import { type Map, Marker as MapboxMarker } from 'mapbox-gl'

import Marker, { type MarkerProps } from 'components/Map/components/Marker'

import { type ApiCluster, type Listing } from 'services/API/types'
import { type Markers } from 'services/Map'
import {
  getMapUrl,
  getMarkerName,
  toMapboxBounds,
  toMapboxPoint
} from 'utils/map'

export class MapService {
  markers: Markers = {}
  clusters: Markers = {}

  createMarkerElement = ({ ...props }: MarkerProps) => {
    const element = <Marker {...props} />

    const container = document.createElement('div')
    const root = createRoot(container)
    root.render(element)

    return container
  }

  showMarkers({
    map,
    listings,
    onClick
  }: {
    map: Map
    listings: Listing[]
    onClick?: (property: Listing) => void
  }): void {
    this.resetClusters()

    listings.forEach((item) => {
      const { mlsNumber, status } = item

      const propertyCenter = item.map
        ? {
            lng: Number(item.map.longitude),
            lat: Number(item.map.latitude)
          }
        : null
      if (!propertyCenter) return

      const singleViewOnMap = this.markers[mlsNumber]
      if (singleViewOnMap) return

      const markerElement = this.createMarkerElement({
        id: getMarkerName(mlsNumber),
        status,
        size: 'point',
        onClick: (e: MouseEvent) => {
          // Prevent redirect on click
          e.preventDefault()
          onClick?.(item)
        }
      })

      const marker = new MapboxMarker(markerElement)
        .setLngLat(propertyCenter)
        .addTo(map)

      this.addMarker(item.mlsNumber, marker)
    })

    // Clearing Marker Residues
    const markersToRemove = Object.keys(this.markers).filter(
      (markerKey) => !listings.some((prop) => prop.mlsNumber === markerKey)
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
