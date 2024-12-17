import { type MouseEvent } from 'react'
import { type Map, Marker } from 'mapbox-gl'

import { type Property } from 'services/API/types'
import { createMarkerElement, type Markers } from 'services/Map'
import { formatPrice } from 'utils/formatters'
import { getMarkerName } from 'utils/map'

export class MapService {
  markers: Markers = {}

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
}

const mapServiceInstance = new MapService()
export default mapServiceInstance
