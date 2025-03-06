import { useEffect, useRef, useState } from 'react'
import { Map as MapboxMap } from 'mapbox-gl'

import { Box, Stack } from '@mui/material'

import { type Listing } from 'services/API/types'
import MapService from 'services/Map'
import { useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { getMapStyleUrl } from 'utils/map'
import {
  mapboxDefaults,
  mapboxToken,
  markersClusteringThreshold
} from 'constants/map'

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
    setMapContainerRef, // TODO: remove
    setMapRef, // TODO: remove
    position,
    setPosition,
    destroyMap
  } = useMapOptions()
  const { request, count, listings, loading, clusters, params } = useSearch()
  const [openDrawer, setOpenDrawer] = useState(false)
  const firstTimeLoaded = useRef(false)
  const { dynamicClustering } = params
  const listingsDisabled = params.listings === 'false'

  setMapContainerRef(mapContainerRef)

  const initializeMap = (container: HTMLElement) => {
    const { center, zoom } = position ?? {}
    if (!zoom || !center) return

    const map = new MapboxMap({
      container,
      ...mapboxDefaults,
      accessToken: mapboxToken,
      style: getMapStyleUrl(style),
      center,
      zoom
    })

    const updatePosition = () => {
      const bounds = map.getBounds()!
      const center = map.getCenter()
      const zoom = map.getZoom()
      setPosition({ bounds, center, zoom })
    }

    // we need this update to fill in bounds on the first load
    map.on('load', updatePosition)
    map.on('moveend', updatePosition)

    setMapRef(map)
  }

  const reinitializeMap = () => {
    const container = mapContainerRef.current
    if (!container) return
    destroyMap()
    initializeMap(container)
  }

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    // Show clusters when either:
    // 1. Clusters exist AND auto-switch is disabled, OR
    // 2. Clusters exist AND auto-switch is enabled BUT count exceeds threshold
    if (
      clusters?.length &&
      (!dynamicClustering || count > markersClusteringThreshold)
    ) {
      MapService.showClusters({ map, clusters })
    } else if (listings.length) {
      MapService.showMarkers({
        map,
        listings,
        onClick: (listing: Listing) => {
          focusMarker(listing.mlsNumber)
        }
      })
    } else {
      // manually delete them all
      MapService.resetAllMarkers()
    }

    if (!firstTimeLoaded.current) {
      firstTimeLoaded.current = true
      setOpenDrawer(true)
    }
    blurMarker()
  }, [clusters, listings, count, dynamicClustering])

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
      if (!map) initializeMap(container)
      else reinitializeMap()
    } else {
      destroyMap()
    }
  }, [canRenderMap])

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
        <MapCounter count={count} loading={loading || !request} />

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
            bottom: openDrawer && !listingsDisabled ? 100 : 0,
            position: 'absolute'
          }}
        >
          <MapDrawButton />
          <MapNavigation />
          <MapStyleSwitch />
          {!listingsDisabled && (
            <CardsCarouselSwitch
              open={openDrawer}
              onClick={() => setOpenDrawer(!openDrawer)}
            />
          )}
        </Stack>
      </Box>
      <CardsCarousel open={openDrawer && !listingsDisabled} />
    </Stack>
  )
}

export default MapRoot
