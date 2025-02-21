import { useEffect, useRef, useState } from 'react'
import { Map as MapboxMap } from 'mapbox-gl'

import { Box, Stack } from '@mui/material'

import { type Listing } from 'services/API/types'
import MapService from 'services/Map'
import { useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { getMapStyleUrl } from 'utils/map'
import { mapboxDefaults, mapboxToken } from 'constants/map'

import CardsCarousel from './CardsCarousel'
import CardsCarouselSwitch from './CardsCarouselSwitch'
import MapContainer from './MapContainer'
import MapCounter from './MapCounter'
import MapDrawButton from './MapDrawButton'
import MapNavigation from './MapNavigation'
import MapStyleSwitch from './MapStyleSwitch'

const MapRoot = ({ expanded = true }: { expanded: boolean }) => {
  const [mapVisible, mapContainerRef] = useIntersectionObserver(0)

  const {
    canRenderMap,
    style,
    mapRef,
    focusMarker,
    blurMarker,
    setMapContainerRef,
    setMapRef,
    position,
    setPosition,
    destroyMap
  } = useMapOptions()
  const { count, listings, loading, clusters } = useSearch()
  const [openDrawer, setOpenDrawer] = useState(false)
  const firstTimeLoaded = useRef(false)

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

  const focusListing = (listing: Listing) => {
    focusMarker(listing.mlsNumber)
  }

  useEffect(() => {
    if (!mapRef.current) return
    if (!listings?.length) {
      MapService.resetMarkers()
      blurMarker()
      return
    }
    // add markers to map
    MapService.showMarkers({
      map: mapRef.current,
      listings,
      onClick: focusListing
    })

    if (!firstTimeLoaded.current) {
      firstTimeLoaded.current = true
      setOpenDrawer(true)
    }
  }, [listings])

  useEffect(() => {
    MapService.showClusterMarkers({ clusters, map: mapRef.current })
  }, [clusters])

  useEffect(() => {
    blurMarker()
  }, [listings])

  useEffect(() => {
    mapRef.current?.resize()
  }, [mapVisible, openDrawer])

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
        <MapCounter count={count} loading={loading} />

        <Stack
          spacing={2}
          direction="column"
          alignItems="flex-end"
          sx={{
            pointerEvents: 'none',
            '& > *': { pointerEvents: 'auto' },
            pb: 2,
            left: 16,
            right: 16,
            bottom: openDrawer ? 98 : 0,
            position: 'absolute'
          }}
        >
          <MapDrawButton />
          <MapNavigation />
          <MapStyleSwitch />
          {Boolean(count) && (
            <CardsCarouselSwitch
              open={openDrawer}
              onClick={() => setOpenDrawer(!openDrawer)}
            />
          )}
        </Stack>
      </Box>
      <CardsCarousel open={openDrawer} />
    </Stack>
  )
}

export default MapRoot
