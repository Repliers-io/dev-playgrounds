import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import { type Map as MapboxMap } from 'mapbox-gl'

import { type MapPosition } from 'services/Map/types'
import { type MapStyle } from 'constants/map-styles'

type MapEditMode = 'draw' | 'highlight' | null

type MapOptionsContextProps = {
  canRenderMap: boolean
  position?: MapPosition
  setPosition: (position: MapPosition) => void
  setCanRenderMap: (loaded: boolean) => void
  blurMarker: () => void
  focusMarker: (mls: string | null) => void
  focusedMarker: string | null
  style: MapStyle
  setStyle: (style: MapStyle) => void
  editMode: MapEditMode
  setEditMode: (mode: MapEditMode) => void
  clearEditMode: () => void
  mapRef: React.MutableRefObject<MapboxMap | null>
  mapContainerRef: React.MutableRefObject<HTMLDivElement | null>
  destroyMap: () => void
  setMapRef: (ref: MapboxMap | null) => void
  setMapContainerRef: (ref: React.RefObject<HTMLDivElement>) => void
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
  const [canRenderMap, setCanRenderMap] = useState(false)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const [mapStyle, setStyle] = useState(style)

  const [focusedMarker, focusMarker] = useState<string | null>(null)

  const [mapPosition, setPosition] = useState<MapPosition | undefined>(
    position || undefined
  )

  const [editMode, setEditMode] = useState<MapEditMode>(null)
  const clearEditMode = () => setEditMode(null)

  const destroyMap = useCallback(() => {
    const map = mapRef.current
    if (map) {
      map.remove()
      mapRef.current = null
    }
  }, [mapRef])

  const contextValue = useMemo(
    () => ({
      canRenderMap,
      position: mapPosition,
      setPosition,
      setCanRenderMap,
      style: mapStyle,
      setStyle,
      editMode,
      setEditMode,
      clearEditMode,
      focusedMarker,
      focusMarker,
      blurMarker: () => focusMarker(null),
      mapRef,
      mapContainerRef,
      destroyMap,
      setMapRef: (ref: MapboxMap | null) => (mapRef.current = ref),
      setMapContainerRef: (ref: React.RefObject<HTMLDivElement>) =>
        (mapContainerRef.current = ref.current)
    }),
    [mapPosition, mapStyle, editMode, canRenderMap, focusedMarker]
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
