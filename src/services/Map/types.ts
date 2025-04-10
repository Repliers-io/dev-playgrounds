import { type LngLat, type LngLatBounds, type Marker } from 'mapbox-gl'

export interface Markers {
  [key: string]: Marker
}

export type MapPosition = {
  center: LngLat | null
  bounds: LngLatBounds | undefined
  zoom: number
}
