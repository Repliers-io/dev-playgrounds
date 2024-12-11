'use client'

import { type MouseEvent } from 'react'
import { type Map, Marker } from 'mapbox-gl'

import { type Property } from 'services/API/types'
import { createMarkerElement, type Markers } from 'services/Map'
import { formatPrice } from 'utils/formatters'
import { getMarkerName } from 'utils/map'

export interface UniqProperty {
  count: number
  property: Property
  mls: string[]
}

export class MarkerExtension {
  markers: Markers = {}

  showMarkers({
    map,
    properties,
    onClick,
    onTap
  }: {
    map: Map
    properties: Property[]
    onClick?: (e: MouseEvent, property: Property) => void
    onTap?: (property: Property) => void
  }): void {
    properties.forEach((property) => {
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
        onClick: (e: MouseEvent) => onClick?.(e, property),
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

      this.add(property.mlsNumber, marker)
    })

    // Clearing Marker Residues
    const markersToRemove = Object.keys(this.markers).filter(
      (markerKey) => !properties.some((prop) => prop.mlsNumber === markerKey)
    )

    this.removeMarkers(markersToRemove)
  }

  add(key: string, marker: Marker) {
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

const markerExtensionInstance = new MarkerExtension()
export default markerExtensionInstance
