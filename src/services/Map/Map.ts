import { type MouseEvent } from 'react'
import { type Map, Marker } from 'mapbox-gl'

import { type ApiCluster, type Listing } from 'services/API/types'
import { createMarkerElement, type Markers } from 'services/Map'
import { formatPrice } from 'utils/formatters'
import {
  getMapUrl,
  getMarkerName,
  toMapboxBounds,
  toMapboxPoint
} from 'utils/map'
import { markersClusteringThreshold } from 'constants/map'

import { MapDataMode } from './types'

export class MapService {
  markers: Markers = {}
  clusterMarkers: Markers = {}

  // NO FUCKIN STATE SWITCHING, GET THE STATE FROM THE FORM!!!
  dataMode: MapDataMode = MapDataMode.SINGLE_MARKER

  // In cluster view, if count is less than 100, we automatically switch to single marker view
  // we can disable this feature by setting clusterAutoSwitch to false
  // NO FUCKIN STATE SWITCHING, GET THE STATE FROM THE FORM!!!
  private clusterAutoSwitch: boolean = true

  // NO FUCKIN STATE SWITCHING, GET THE STATE FROM THE FORM!!!
  get singleMarkerView() {
    return this.dataMode === MapDataMode.SINGLE_MARKER
  }

  // NO FUCKIN STATE SWITCHING, GET THE STATE FROM THE FORM!!!
  get clusterView() {
    return this.dataMode === MapDataMode.CLUSTER
  }

  // NO FUCKIN STATE SWITCHING, GET THE STATE FROM THE FORM!!!
  setViewMode(mode: MapDataMode): void {
    this.dataMode = mode
  }

  // NO FUCKIN STATE SWITCHING, GET THE STATE FROM THE FORM!!!
  setClusterAutoSwitch(enabled: boolean) {
    this.clusterAutoSwitch = enabled
  }

  resetAllMarkers() {
    this.resetMarkers()
    this.resetClusters()
  }

  // IT SHOULD NOT
  shouldSwitchToSingleMarkerView(count: number) {
    if (this.singleMarkerView) return true
    return (
      this.clusterView &&
      this.clusterAutoSwitch &&
      count < markersClusteringThreshold
    )
  }

  // IT SHOULD NOT
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
    onClick
  }: {
    map: Map
    listings: Listing[]
    onClick?: (property: Listing) => void
  }): void {
    if (!this.singleMarkerView) return

    listings.forEach((property) => {
      const { mlsNumber, listPrice, status } = property

      const propertyCenter = property.map
        ? {
            lng: Number(property.map.longitude),
            lat: Number(property.map.latitude)
          }
        : null

      if (!propertyCenter) return

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
          onClick?.(property)
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

      const mapboxBounds = toMapboxBounds(bounds)

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

  // USELESS SHIT! WHYDAFUQ IT HAS list ARGUMENT!!???
  update(list: Listing[], clusters: ApiCluster[], count: number): void {
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
