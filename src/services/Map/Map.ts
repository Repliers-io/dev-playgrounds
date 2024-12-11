import { type MouseEvent } from 'react'
import { type Map, type Marker } from 'mapbox-gl'

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
    if (!map || !listings.length) return
    // TODO: refactor markerExtension
    // TODO: remove store and map references
    this.markerExtension.showMarkers({
      map,
      listings,
      onClick,
      onTap
    })
  }
}
const mapServiceInstance = new MapService()
export default mapServiceInstance
