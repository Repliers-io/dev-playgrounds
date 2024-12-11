import { type MouseEvent } from 'react'
import { type Marker } from 'mapbox-gl'

import { type Property } from 'services/API/types'
import MarkerExtensionService, {
  type MarkerExtension
} from 'services/Map/MarkerExtension'

export class MapService {
  markerExtension: MarkerExtension

  constructor() {
    this.markerExtension = MarkerExtensionService
  }

  getMarker(mlsNumber: string): Marker | undefined {
    return this.markerExtension.markers[mlsNumber]
  }

  update(): void {
    this.markerExtension.resetMarkers()
  }

  showMarkers({
    properties,
    onClick,
    onTap,
    map
  }: {
    properties: Property[]
    onClick?: (e: MouseEvent, property: Property) => void
    onTap?: (property: Property) => void
    map: any
  }): void {
    if (!map || !properties.length) return
    // TODO: refactor markerExtension
    // TODO: remove store and map references
    this.markerExtension.showMarkers({
      map,
      properties,
      onClick,
      onTap
    })
  }
}
const mapServiceInstance = new MapService()
export default mapServiceInstance
