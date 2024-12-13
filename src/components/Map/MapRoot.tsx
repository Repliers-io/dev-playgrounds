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

import MapService from 'services/Map'
import { useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { getDefaultBounds, getMapStyleUrl } from 'utils/map'
import { mapboxDefaults, mapboxToken } from 'constants/map'

import CardsCarousel from './CardsCarousel'
import MapContainer from './MapContainer'
import MapNavigation from './MapNavigation'
import MapStyleSwitch from './MapStyleSwitch'

const MapRoot = ({ expanded = true }: { expanded: boolean }) => {
  const [mapVisible, mapContainerRef] = useIntersectionObserver(0)

  const { style, mapRef, setMapRef, setPosition } = useMapOptions()
  const { count, listings, loading } = useSearch()
  const [drawer, setDrawer] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const initializeMap = (container: HTMLElement) => {
    const map = new MapboxMap({
      container,
      ...mapboxDefaults,
      accessToken: mapboxToken,
      bounds: getDefaultBounds(),
      style: getMapStyleUrl(style)
    })

    map.on('load', () => {
      const bounds = map.getBounds()!
      const center = map.getCenter()
      const zoom = map.getZoom()
      setLoaded(true)
      if (loaded) setPosition({ bounds, center, zoom })
    })

    map.on('moveend', () => {
      const bounds = map.getBounds()!
      const center = map.getCenter()
      const zoom = map.getZoom()
      setPosition({ bounds, center, zoom })
    })

    setMapRef(map)
  }

  const handleDrawerClick = () => {
    setDrawer(!drawer)
  }

  useEffect(() => {
    if (!mapRef.current) return
    if (!listings?.length) return
    // add markers to map
    MapService.showMarkers({ map: mapRef.current, listings })
  }, [listings])

  useEffect(() => {
    mapRef.current?.resize()
  }, [mapVisible, drawer])

  useEffect(() => {
    mapRef.current?.setStyle(getMapStyleUrl(style))
  }, [style])

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      initializeMap(mapContainerRef.current)
    }
  }, [mapContainerRef])

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
            bottom: drawer ? 102 : 0,
            left: 0,
            right: 0
          }}
        >
          <MapNavigation />
          <MapStyleSwitch />

          {count && (
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
