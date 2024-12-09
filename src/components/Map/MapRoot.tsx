import { useEffect, useState } from 'react'
import { type Position } from 'geojson'
import { Map as MapboxMap } from 'mapbox-gl'

import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { Box, IconButton, Stack, Typography } from '@mui/material'

import {
  type Filters,
  getDefaultRectangle,
  getMapPolygon,
  getMapRectangle
} from 'services/Search'
import { type MapPosition, useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { getDefaultBounds, getMapStyleUrl } from 'utils/map'
import { mapboxDefaults, mapboxToken } from 'constants/map'

import MapContainer from './MapContainer'
import MapNavigation from './MapNavigation'
import MapStyleSwitch from './MapStyleSwitch'

const MapRoot = ({ expanded = true }: { expanded: boolean }) => {
  const [mapVisible, mapContainerRef] = useIntersectionObserver(0)
  const { search, save, filters, polygon } = useSearch()
  const { style, mapRef, setMapRef, position, setPosition } = useMapOptions()
  const [drawer, setDrawer] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const handleDrawerClick = () => {
    setDrawer(!drawer)
  }

  const fetchData = async (
    position: MapPosition,
    filters: Filters,
    polygon: Position[] | null
  ) => {
    const { bounds } = position

    const fetchBounds = polygon
      ? getMapPolygon(polygon)
      : bounds
        ? getMapRectangle(bounds)
        : getDefaultRectangle()

    const response = await search({
      ...filters,
      ...fetchBounds
      // ...getPageParams(),
      // ...getListingFields()
      // ...getClusterParams(zoom)
    })
    if (!response) return
    const { list, clusters, count } = save(response)
    console.log('count', count, 'list', list, 'clusters', clusters)
    //   // MapService.update(list, clusters, count)
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
      const bounds = map.getBounds()!
      const center = map.getCenter()
      const zoom = map.getZoom()
      setLoaded(true)
      setPosition({ bounds, center, zoom })
    })

    map.on('moveend', () => {
      const bounds = map.getBounds()!
      const center = map.getCenter()
      const zoom = map.getZoom()
      setPosition({ bounds, center, zoom })
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

  useEffect(() => {
    if (loaded) fetchData(position, filters, polygon)
  }, [position, filters, polygon])

  return (
    <Stack flex={1} spacing={1} sx={{ display: expanded ? 'none' : 'flex' }}>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          borderRadius: 2,
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
          <IconButton
            size="small"
            onClick={handleDrawerClick}
            sx={{ width: 30, height: 30 }}
          >
            {drawer ? (
              <ArrowDownwardIcon sx={{ fontSize: 24 }} />
            ) : (
              <ArrowUpwardIcon sx={{ fontSize: 24 }} />
            )}
          </IconButton>
          <Typography
            variant="h6"
            fontSize="12px"
            lineHeight="30px"
            textTransform="uppercase"
          >
            12345 Listings
          </Typography>
        </Stack>
        <Box
          sx={{
            p: 1.25,
            height: 280,
            boxSizing: 'border-box',
            bgcolor: 'background.default',
            display: drawer ? 'block' : 'none',
            border: 1,
            borderRadius: 2,
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
