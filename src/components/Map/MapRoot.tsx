import { useEffect, useState } from 'react'
import { Map as MapboxMap } from 'mapbox-gl'

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import {
  alpha,
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Typography
} from '@mui/material'

import { type Property } from 'services/API/types'
import MapService from 'services/Map'
import { useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import {
  highlightJsonItem,
  removeHighlight,
  scrollToElementByText
} from 'utils/dom'
import { getMapStyleUrl } from 'utils/map'
import { mapboxDefaults, mapboxToken } from 'constants/map'

import CardsCarousel from './CardsCarousel'
import MapContainer from './MapContainer'
import MapNavigation from './MapNavigation'
import MapStyleSwitch from './MapStyleSwitch'

const getHighlightedMarker = (
  listings: Property[],
  highlightedMarker: string | number | null
) => {
  if (!highlightedMarker) return null
  return listings.find((item) => item.mlsNumber === highlightedMarker)
}

const MapRoot = ({ expanded = true }: { expanded: boolean }) => {
  const [mapVisible, mapContainerRef] = useIntersectionObserver(0)

  const {
    canRenderMap,
    style,
    mapRef,
    highlightedMarker,
    setHighlightedMarker,
    setMapContainerRef,
    setMapRef,
    position,
    setPosition,
    destroyMap
  } = useMapOptions()
  const { count, listings, loading, clusters } = useSearch()
  const [drawer, setDrawer] = useState(false)

  setMapContainerRef(mapContainerRef)

  const initializeMap = (container: HTMLElement) => {
    const { center, zoom, bounds } = position ?? {}
    if (!bounds || !zoom || !center) return

    const map = new MapboxMap({
      container,
      accessToken: mapboxToken,
      ...mapboxDefaults,
      center,
      zoom,
      bounds,
      style: getMapStyleUrl(style)
    })

    map.on('moveend', () => {
      const bounds = map.getBounds()!
      const center = map.getCenter()
      const zoom = map.getZoom()
      setPosition({ bounds, center, zoom })
    })

    setMapRef(map)
  }

  const reinitializeMap = () => {
    const container = mapContainerRef.current
    if (!container) return
    destroyMap()
    initializeMap(container)
  }

  const handleDrawerClick = () => {
    setDrawer(!drawer)
  }

  useEffect(() => {
    if (!mapRef.current) return
    if (!listings?.length) {
      MapService.resetMarkers()
      setHighlightedMarker(null)
      return
    }
    // add markers to map
    MapService.showMarkers({
      map: mapRef.current,
      listings,
      onClick: (e, property) => {
        scrollToElementByText(`${property.mlsNumber}`)
        highlightJsonItem(`${property.mlsNumber}`)
        setHighlightedMarker(property.mlsNumber)
      }
    })
  }, [listings])

  useEffect(() => {
    MapService.showClusterMarkers({ clusters, map: mapRef.current })
  }, [clusters])

  useEffect(() => {
    const highlighted = getHighlightedMarker(listings, highlightedMarker)
    if (!highlighted) {
      setHighlightedMarker(null)
      removeHighlight()
    }
  }, [listings, highlightedMarker])

  useEffect(() => {
    mapRef.current?.resize()
  }, [mapVisible, drawer])

  useEffect(() => {
    mapRef.current?.setStyle(getMapStyleUrl(style))
  }, [style])

  useEffect(() => {
    const map = mapRef.current
    const container = mapContainerRef.current

    if (!container) return

    if (canRenderMap) {
      if (map) {
        reinitializeMap()
      } else {
        initializeMap(container)
      }
    } else {
      destroyMap()
    }
  }, [canRenderMap, mapContainerRef])

  return (
    <Stack
      flex={1}
      spacing={1.5}
      sx={{ position: 'relative', display: expanded ? 'none' : 'flex' }}
    >
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          '& .mapboxgl-marker': {
            position: 'absolute !important',
            top: 0,
            left: 0
          }
        }}
      >
        <MapContainer ref={mapContainerRef} />
        <Stack
          spacing={0.5}
          direction="row"
          alignItems="center"
          sx={{
            left: 16,
            top: 16,
            position: 'absolute',
            backdropFilter: 'blur(4px)',
            bgcolor: alpha('#FFFFFF', 0.7),
            borderRadius: 6,
            boxShadow: 1,
            p: 0.25,
            pr: 1.5
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={14} sx={{ p: 1 }} />
              <Typography>Loading ...</Typography>
            </>
          ) : (
            <Typography sx={{ pl: 1, lineHeight: '30px' }}>
              {count} Listings
            </Typography>
          )}
        </Stack>
        <Box
          sx={{
            position: 'absolute',
            bottom: drawer ? 98 : 0,
            left: 0,
            right: 0
          }}
        >
          <MapNavigation />
          <MapStyleSwitch />

          {Boolean(count) && (
            <Box sx={{ position: 'absolute', left: 16, bottom: 16 }}>
              <IconButton
                size="small"
                onClick={handleDrawerClick}
                sx={{
                  width: 30,
                  height: 30,
                  backdropFilter: 'blur(4px)',
                  bgcolor: alpha('#FFFFFF', 0.7),
                  '&:hover': { bgcolor: '#fff' },
                  boxShadow: 1
                }}
              >
                {drawer ? (
                  <ArrowDownwardIcon sx={{ fontSize: 24 }} />
                ) : (
                  <ArrowUpwardIcon sx={{ fontSize: 24 }} />
                )}
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
      <CardsCarousel drawer={drawer} />
    </Stack>
  )
}

export default MapRoot
