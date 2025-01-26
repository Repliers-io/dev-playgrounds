import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react'
import { type Map as MapboxMap } from 'mapbox-gl'

import { Alert, AlertColor, Snackbar, type SnackbarOrigin } from '@mui/material'

import { type MapPosition } from 'services/Map/types'
import { type MapStyle } from 'constants/map-styles'

type MapOptionsContextProps = {
  canRenderMap: boolean
  position?: MapPosition
  setPosition: (position: MapPosition) => void
  setCanRenderMap: (loaded: boolean) => void
  highlightedMarker: string | null
  setHighlightedMarker: (mls: string | null) => void
  style: MapStyle
  setStyle: (style: MapStyle) => void
  mapRef: React.MutableRefObject<MapboxMap | null>
  mapContainerRef: React.MutableRefObject<HTMLDivElement | null>
  destroyMap: () => void
  setMapRef: (ref: MapboxMap | null) => void
  setMapContainerRef: (ref: React.RefObject<HTMLDivElement>) => void
  showSnackbar: (message: string, severity: AlertColor) => void
  hideSnackbar: () => void
}

interface SnackbarState extends SnackbarOrigin {
  open: boolean
  message: string | null
  severity: AlertColor
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

  const [highlightedMarker, setHighlightedMarker] = useState<string | null>(
    null
  )

  const [mapPosition, setPosition] = useState<MapPosition | undefined>(
    position || undefined
  )

  const [snackbarState, setSnackbarState] = React.useState<SnackbarState>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
    severity: 'info'
  })
  const { vertical, horizontal, open, message: snackbarMessage } = snackbarState

  const showSnackbar = (message: string, severity: AlertColor = 'info') => {
    setSnackbarState({ ...snackbarState, open: true, message, severity })
  }

  const hideSnackbar = () => {
    setSnackbarState({ ...snackbarState, open: false, message: null })
  }

  const destroyMap = useCallback(() => {
    const map = mapRef.current
    if (map) {
      map.remove()
      mapRef.current = null
    }
  }, [mapRef])

  const contextValue = useMemo(
    () => ({
      highlightedMarker,
      setHighlightedMarker,
      canRenderMap,
      position: mapPosition,
      setPosition,
      setCanRenderMap,
      style: mapStyle,
      setStyle,
      mapRef,
      mapContainerRef,
      destroyMap,
      setMapRef: (ref: MapboxMap | null) => (mapRef.current = ref),
      setMapContainerRef: (ref: React.RefObject<HTMLDivElement>) =>
        (mapContainerRef.current = ref.current),
      showSnackbar,
      hideSnackbar
    }),
    [mapPosition, mapStyle, canRenderMap, highlightedMarker]
  )

  return (
    <MapOptionsContext.Provider value={contextValue}>
      {children}
      <Snackbar open={open} anchorOrigin={{ vertical, horizontal }}>
        <Alert severity="warning" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
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
