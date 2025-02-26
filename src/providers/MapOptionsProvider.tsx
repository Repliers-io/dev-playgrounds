import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { LngLat, type Map as MapboxMap } from 'mapbox-gl'
import queryString from 'query-string'

import { type MapPosition } from 'services/Map/types'
import { fetchLocations } from 'utils/api'
import { getLocations, getMapPosition } from 'utils/map'
import { type MapStyle } from 'constants/map-styles'

import { useSearch } from './SearchProvider'

type MapEditMode = 'draw' | 'highlight' | null

type MapOptionsContextProps = {
  canRenderMap: boolean
  position?: MapPosition
  setPosition: (position: MapPosition) => void
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
  // position,
  children
}: {
  style: MapStyle
  // position?: MapPosition
  children?: React.ReactNode
}) => {
  const {
    params: { apiKey, apiUrl }
  } = useSearch()

  const [canRenderMap, setCanRenderMap] = useState(false)
  const [mapPosition, setPosition] = useState<MapPosition | undefined>(
    undefined
  )

  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapboxMap | null>(null)
  const [mapStyle, setStyle] = useState(style)

  const [focusedMarker, focusMarker] = useState<string | null>(null)

  const [editMode, setEditMode] = useState<MapEditMode>(null)
  const clearEditMode = () => setEditMode(null)

  const destroyMap = useCallback(() => {
    const map = mapRef.current
    if (map) {
      map.remove()
      mapRef.current = null
    }
  }, [mapRef])

  // subscription to apiKey changes must refetch listings
  // for calculate position/bounds/zoom
  useEffect(() => {
    if (!apiKey || !apiUrl) return

    const params = queryString.parse(window.location.search)
    const { lng, lat, zoom } = params
    if (lng && lat && zoom) {
      setPosition({
        center: new LngLat(Number(lng), Number(lat)),
        zoom: Number(zoom),
        bounds: undefined
      })
      setCanRenderMap(true)
    } else {
      fetchLocations({ apiKey, apiUrl }).then((listings) => {
        const locations = getLocations(listings)
        if (!locations?.length || !mapContainerRef.current) return
        const mapPosition = getMapPosition(locations, mapContainerRef.current)
        setPosition(mapPosition)
        setCanRenderMap(true)
      })
    }
  }, [apiKey, apiUrl])

  const contextValue = useMemo(
    () => ({
      canRenderMap,
      position: mapPosition,
      setPosition,
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
