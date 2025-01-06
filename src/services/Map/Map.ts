import { type MouseEvent } from 'react'
import { type Map, Marker } from 'mapbox-gl'

import { type ApiCluster, type Property } from 'services/API/types'
import { createMarkerElement, MAP_CONSTANTS, type Markers } from 'services/Map'
import { formatPrice } from 'utils/formatters'
import {
  getMapUrl,
  getMarkerName,
  toMapboxBounds,
  toMapboxPoint
} from 'utils/map'

import { MapDataMode } from './types.ts'

export class MapService {
  markers: Markers = {}
  clusterMarkers: Markers = {}

  dataMode: MapDataMode = MapDataMode.SINGLE_MARKER

  // force toggle to single marker view when count is less than 100
  private clusterAutoSwitch: boolean = true

  get singleMarkerView() {
    return this.dataMode === MapDataMode.SINGLE_MARKER
  }

  get clusterView() {
    return this.dataMode === MapDataMode.CLUSTER
  }

  setViewMode(mode: MapDataMode): void {
    this.dataMode = mode
  }

  setClusterAutoSwitch(enabled: boolean) {
    this.clusterAutoSwitch = enabled
  }

  resetAllMarkers() {
    this.resetMarkers()
    this.resetClusters()
  }

  shouldSwitchToSingleMarkerView(count: number) {
    if (this.singleMarkerView) return true
    return (
      this.clusterView &&
      this.clusterAutoSwitch &&
      count < MAP_CONSTANTS.API_COUNT_TO_ENABLE_CLUSTERING
    )
  }

  shouldSwitchToClusterView() {
    return this.clusterView
  }

  switchToSingleMarkerView() {
    this.setViewMode(MapDataMode.SINGLE_MARKER)
    this.resetClusters()
  }

  switchToClusterView(clusters?: ApiCluster[]) {
    this.setViewMode(MapDataMode.CLUSTER)
    this.resetMarkers()
    if (clusters) {
      this.smartResetClusters(clusters)
    }
  }

  private getClusterKey(cluster: ApiCluster): string {
    return `c-${cluster.count}-lat-${cluster.location.latitude}-lng-${cluster.location.longitude}`
  }

  getMarker(mlsNumber: string): Marker | undefined {
    return this.markers[mlsNumber]
  }

  showMarkers({
    map,
    listings,
    onClick,
    onTap
  }: {
    map: Map
    listings: Property[]
    onClick?: (e: MouseEvent, property: Property) => void
    onTap?: (property: Property) => void
  }): void {
    if (!this.singleMarkerView) return

    listings.forEach((property) => {
      const { mlsNumber, listPrice, status } = property

      const propertyCenter = {
        lng: Number(property.map.longitude),
        lat: Number(property.map.latitude)
      }

      const singleViewOnMap = this.markers[mlsNumber]

      if (singleViewOnMap) return

      const label = formatPrice(listPrice)

      const link = ''

      const markerElement = createMarkerElement({
        id: getMarkerName(mlsNumber),
        link,
        label,
        status,
        size: 'point',
        onClick: (e: MouseEvent) => {
          // Prevent redirect on click
          e.preventDefault()
          onClick?.(e, property)
        },
        onTap: () => {
          const markerCenterPixels = map.project([
            propertyCenter.lng,
            propertyCenter.lat
          ])

          // markerCenterPixels.y += Number(propertyCardSizes.drawer.height) / 2 // half of the drawer height
          const markerCenterCoords = map.unproject(markerCenterPixels)

          map.flyTo({
            center: markerCenterCoords,
            curve: 1
          })

          map.once('moveend', () => {
            onTap?.(property)
          })
        }
      })

      const marker = new Marker(markerElement)
        .setLngLat(propertyCenter)
        .addTo(map)

      this.addMarker(property.mlsNumber, marker)
    })

    // Clearing Marker Residues
    const markersToRemove = Object.keys(this.markers).filter(
      (markerKey) => !listings.some((prop) => prop.mlsNumber === markerKey)
    )

    this.removeMarkers(markersToRemove)
  }

  addMarker(key: string, marker: Marker) {
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

  resetMarkers() {
    const markers = Object.values(this.markers)
    markers.forEach((marker) => marker.remove())

    this.markers = {}
  }

  // Clustering
  showClusterMarkers({
    clusters,
    map
  }: {
    clusters: ApiCluster[]
    map: Map | null
  }): void {
    if (!clusters.length || !map || !this.clusterView) return

    this.smartResetClusters(clusters)

    clusters.forEach((cluster) => {
      if (this.clusterMarkers[this.getClusterKey(cluster)]) return

      const { bounds, location } = cluster
      const center = toMapboxPoint(location)
      const zoom = map.getZoom()

      const diff = bounds.bottom_right.longitude - bounds.top_left.longitude
      const buffer = diff * MAP_CONSTANTS.ZOOM_TO_MARKER_BUFFER
      const mapboxBounds = toMapboxBounds(bounds, buffer)

      const markerElement = createMarkerElement({
        size: 'cluster',
        link: getMapUrl(center, zoom),
        label: cluster.count.toString(),
        onClick: (e) => {
          map.fitBounds(mapboxBounds)
          e.preventDefault()
        }
      })

      const marker = new Marker(markerElement).setLngLat(center).addTo(map)

      this.addCluster(this.getClusterKey(cluster), marker)
    })
  }

  addCluster(key: string, marker: Marker) {
    if (!this.clusterMarkers[key]) {
      this.clusterMarkers[key] = marker
    }
  }

  resetClusters() {
    const markers: Marker[] = Object.values(this.clusterMarkers)
    markers.forEach((marker) => marker.remove())

    this.clusterMarkers = {}
  }

  smartResetClusters(clusters: ApiCluster[]) {
    const newClusterKeys = clusters.map((cluster) =>
      this.getClusterKey(cluster)
    )
    const renderedClusterKeys = Object.keys(this.clusterMarkers)

    renderedClusterKeys.forEach((key) => {
      if (!newClusterKeys.includes(key)) {
        this.clusterMarkers[key].remove()
        delete this.clusterMarkers[key]
      }
    })
  }

  update(list: Property[], clusters: ApiCluster[], count: number): void {
    if (!count) {
      this.resetAllMarkers()
      return
    }

    if (this.shouldSwitchToSingleMarkerView(count)) {
      this.switchToSingleMarkerView()
      return
    }

    if (this.shouldSwitchToClusterView()) {
      this.switchToClusterView(clusters)
      return
    }
  }
}

const mapServiceInstance = new MapService()
export default mapServiceInstance
