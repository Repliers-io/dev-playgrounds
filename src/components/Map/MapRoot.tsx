import { useEffect, useState } from 'react'
import { type LngLat, type LngLatBounds, Map as MapboxMap } from 'mapbox-gl'

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { Box, IconButton, Stack, Typography } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { getDefaultBounds, getMapStyleUrl } from 'utils/map'
import { mapboxDefaults, mapboxToken } from 'constants/map'

import MapContainer from './MapContainer'
import MapNavigation from './MapNavigation'
import MapStyleSwitch from './MapStyleSwitch'

const MapRoot = ({
  expanded = true,
  onMove,
  onLoad
}: {
  expanded: boolean
  onMove?: (bounds: LngLatBounds, center: LngLat, zoom: number) => void
  onLoad?: (bounds: LngLatBounds, center: LngLat, zoom: number) => void
}) => {
  const [mapVisible, mapContainerRef] = useIntersectionObserver(0)
  const { style, mapRef, setMapRef } = useMapOptions()
  const [drawer, setDrawer] = useState(false)

  const handleDrawerClick = () => {
    setDrawer(!drawer)
  }

  const initializeMap = (container: HTMLElement) => {
    const map = new MapboxMap({
      container,
      ...mapboxDefaults,
      accessToken: mapboxToken,
      bounds: getDefaultBounds(),
      style: getMapStyleUrl(style)
    })

    map.on('load', () => {
      onLoad?.(map.getBounds()!, map.getCenter(), map.getZoom())
    })

    map.on('moveend', () => {
      onMove?.(map.getBounds()!, map.getCenter(), map.getZoom())
    })

    setMapRef(map)
  }

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      initializeMap(mapContainerRef.current)
    }
  }, [mapContainerRef])

  useEffect(() => {
    mapRef.current?.setStyle(getMapStyleUrl(style))
  }, [style])

  useEffect(() => {
    mapRef.current?.resize()
  }, [mapVisible, drawer])

  return (
    <Stack flex={1} spacing={1} sx={{ display: expanded ? 'none' : 'flex' }}>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <MapContainer ref={mapContainerRef} />
        <MapNavigation />
        <MapStyleSwitch />
      </Box>
      <Stack spacing={1}>
        <Stack spacing={1} direction="row" alignItems="center">
          <IconButton size="small" onClick={handleDrawerClick}>
            {drawer ? (
              <ArrowDownwardIcon sx={{ fontSize: 24 }} />
            ) : (
              <ArrowUpwardIcon sx={{ fontSize: 24 }} />
            )}
          </IconButton>
          <Typography variant="h6">XXX Listings</Typography>
        </Stack>
        <Box
          sx={{
            p: 1,
            height: 280,
            boxSizing: 'border-box',
            bgcolor: 'background.default',
            display: drawer ? 'block' : 'none',
            border: 1,
            borderRadius: 1,
            borderColor: '#eee'
          }}
        >
          cards carousel
        </Box>
      </Stack>
    </Stack>
  )
}

export default MapRoot
