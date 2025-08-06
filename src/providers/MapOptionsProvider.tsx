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

import { type MapPosition } from 'services/Map/types'
import { fetchListings } from 'utils/api'
import { getLocations, getMapPosition } from 'utils/map'
import { type MapStyle } from 'constants/map-styles'

import { useSearch } from './SearchProvider'

type MapEditMode = 'draw' | 'highlight' | null

type MapOptionsContextProps = {
  canRenderMap: boolean
  position?: MapPosition
  setPosition: (position: MapPosition) => void
  blurMarker: () => void
  focusMarker: (mlsNumber: string, boardId: number) => void
  focusLocation: (locationId: string) => void
  focusedMarker: string | null
  style: MapStyle
  setStyle: (style: MapStyle) => void
  editMode: MapEditMode
  setEditMode: (mode: MapEditMode) => void
  clearEditMode: () => void
  destroyMap: () => void
  centerMap: (apiKey: string, apiUrl: string) => void
  mapRef: React.MutableRefObject<MapboxMap | null>
  setMapRef: (ref: MapboxMap | null) => void
  mapContainerRef: React.MutableRefObject<HTMLDivElement | null>
  setMapContainerRef: (ref: React.RefObject<HTMLDivElement>) => void
}

const MapOptionsContext = createContext<MapOptionsContextProps | undefined>(
  undefined
)

export type MapCoords = {
  lng: string
  lat: string
  zoom: string
}

const MapOptionsProvider = ({
  style = 'map',
  params,
  // custom position used to initialize the map
  // on search results or saved searches polygon
  // position,
  children
}: {
  style: MapStyle
  params?: MapCoords
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
  const [editMode, setEditMode] = useState<MapEditMode>(null)
  const [focusedMarker, setFocusedMarker] = useState<string | null>(null)

  const focusMarker = (mlsNumber: string, boardId: number) => {
    const markerName = `marker-${mlsNumber}-${boardId}`
    setFocusedMarker(markerName)
  }

  const focusLocation = (locationId: string) => {
    setFocusedMarker(locationId)
  }
  const clearEditMode = () => setEditMode(null)

  const destroyMap = useCallback(() => {
    const map = mapRef.current
    if (map) {
      map.remove()
      mapRef.current = null
    }
  }, [])

  const centerMap = useCallback(
    (apiKey: string, apiUrl: string) => {
      fetchListings({ apiKey, apiUrl }).then((listings) => {
        const locations = getLocations(listings)
        if (!locations?.length || !mapContainerRef.current) return
        const mapPosition = getMapPosition(locations, mapContainerRef.current)
        setPosition(mapPosition)
        if (canRenderMap) {
          mapRef.current?.jumpTo({
            center: mapPosition.center,
            zoom: mapPosition.zoom
          })
        } else {
          setCanRenderMap(true)
        }
      })
    },
    [canRenderMap]
  )

  const setMapRef = useCallback((ref: MapboxMap | null) => {
    mapRef.current = ref
  }, [])

  const setMapContainerRef = useCallback(
    (ref: React.RefObject<HTMLDivElement>) => {
      mapContainerRef.current = ref.current
    },
    []
  )

  useEffect(() => {
    if (!apiKey || !apiUrl || !params) return
    const { lng, lat, zoom } = params
    if (lng && lat && zoom) {
      setPosition({
        center: new LngLat(Number(lng), Number(lat)),
        zoom: Number(zoom),
        bounds: mapRef.current ? mapRef.current.getBounds()! : undefined
      })
      setCanRenderMap(true)
    } else {
      centerMap(apiKey, apiUrl)
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
      focusLocation,
      blurMarker: () => setFocusedMarker(null),
      destroyMap,
      centerMap,
      mapRef,
      setMapRef,
      mapContainerRef,
      setMapContainerRef
    }),
    [
      mapPosition,
      mapStyle,
      editMode,
      canRenderMap,
      focusedMarker,
      destroyMap,
      centerMap
    ]
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
