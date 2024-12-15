import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import mapboxgl, { type Map as MapboxMap } from 'mapbox-gl'
import queryString from 'query-string'

import { type MapPosition } from 'services/Map/types'
import { getDefaultBounds, getLngLatCenter } from 'utils/map'
import { mapboxDefaults } from 'constants/map'
import { type MapStyle } from 'constants/map-styles'

type MapOptionsContextProps = {
  loaded: boolean
  setLoaded: (loaded: boolean) => void
  position: MapPosition
  setPosition: (position: MapPosition) => void
  style: MapStyle
  setStyle: (style: MapStyle) => void
  mapRef: React.MutableRefObject<MapboxMap | null>
  setMapRef: (ref: MapboxMap) => void
}

const MapOptionsContext = createContext<MapOptionsContextProps | undefined>(
  undefined
)

const MapOptionsProvider = ({
  style = 'map',
  // custom position used to initialize the map
  // on search results or saved searches polygon
  position,
  children
}: {
  style: MapStyle
  position?: MapPosition
  children?: React.ReactNode
}) => {
  const mapRef = useRef<MapboxMap | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [mapStyle, setStyle] = useState(style)
  const params = useMemo(() => queryString.parse(window.location.search), [])
  const { lng, lat } = params

  const bounds = getDefaultBounds()
  const center =
    lng && lat
      ? new mapboxgl.LngLat(Number(lng), Number(lat))
      : getLngLatCenter(bounds)
  const zoom = Number(params.zoom) || mapboxDefaults.zoom!

  const initialPosition = useMemo(
    () => ({
      bounds,
      center,
      zoom
    }),
    []
  )

  const [mapPosition, setPosition] = useState<MapPosition>(
    position || initialPosition
  )

  const contextValue = useMemo(
    () => ({
      loaded,
      setLoaded,
      position: mapPosition,
      setPosition,
      style: mapStyle,
      setStyle,
      mapRef,
      setMapRef: (ref: MapboxMap) => (mapRef.current = ref)
    }),
    [mapPosition, mapStyle]
  )

  return (
    <MapOptionsContext.Provider value={contextValue}>
      {children}
    </MapOptionsContext.Provider>
  )
}

export default MapOptionsProvider

export const useMapOptions = () => {
  const context = useContext(MapOptionsContext)
  if (!context) {
    throw new Error('useMapOptions must be used within a MapOptionsProvider')
  }
  return context
}
