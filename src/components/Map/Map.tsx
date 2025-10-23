import { useEffect, useRef, useState } from 'react'
import { Map as MapboxMap } from 'mapbox-gl'

import { Box, Stack } from '@mui/material'

import { type Listing } from 'services/API/types'
import MapService from 'services/Map'
import { useLocations } from 'providers/LocationsProvider'
import { useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { getLocationName, getMapStyleUrl, getMarkerName } from 'utils/map'
import {
  mapboxDefaults,
  mapboxToken,
  markersClusteringThreshold
} from 'constants/map'

import './Map.css'

import {
  CardsCarousel,
  CardsCarouselSwitch,
  MapCenterPoint,
  MapClusterWarnings,
  MapContainer,
  MapCounter,
  MapDrawButton,
  MapNavigation,
  MapStyleSwitch,
  SearchField
} from './components'

const MapRoot = () => {
  const [mapVisible, mapContainerRef] = useIntersectionObserver(0)

  const {
    canRenderMap,
    style,
    mapRef,
    focusedMarker,
    focusMarker,
    focusLocation,
    blurMarker,
    setMapContainerRef, // TODO: remove
    setMapRef, // TODO: remove
    position,
    setPosition
  } = useMapOptions()
  const { locations } = useLocations()
  const { request, count, listings, loading, clusters, params } = useSearch()
  const prevFocusedMarker = useRef<HTMLElement | null>(null)
  const prevFocusedPolygon = useRef<string | null>(null)
  const [openDrawer, setOpenDrawer] = useState(false)
  const firstTimeLoaded = useRef(false)
  const { dynamicClustering } = params

  const listingsDisabled = params.listings === 'false'

  const locationsTab = params.tab === 'locations'
  const statisticsTab = params.tab === 'stats'
  const listingTab = params.tab === 'listing'
  const listingsTab = !locationsTab && !statisticsTab && !listingTab

  const centerPoint = params.center

  setMapContainerRef(mapContainerRef)

  const initializeMap = (container: HTMLElement, attempt: number = 0) => {
    const { center, zoom } = position ?? {}
    if (!zoom || !center) return

    const { width, height } = container.getBoundingClientRect()
    if (width === 0 || height === 0) {
      // Limit attempts: ~60 fps * 2 seconds = 120 attempts
      const maxAttempts = 120
      if (attempt >= maxAttempts) return

      // Use requestAnimationFrame to check on every frame until dimensions are available
      requestAnimationFrame(() => initializeMap(container, attempt + 1))
      return
    }
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

  const showMarkersAndClusters = () => {
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
        items: listings.map((listing) => ({
          ...listing,
          id: getMarkerName(listing)
        })),
        onClick: (listing: Listing) => {
          focusMarker(listing.mlsNumber, listing.boardId)
        }
      })
    }
  }

  const showLocations = () => {
    const map = mapRef.current
    if (!map) return
    if (locations) {
      MapService.showMarkers({
        map,
        items: locations.map((location) => {
          const { locationId, map, name: label } = location
          return {
            id: getLocationName(location),
            size: 'location',
            locationId,
            label,
            map
          } as any
        }),
        onClick: (location) => {
          focusLocation(getLocationName(location))
        }
      })
    }
  }

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (listingsTab) {
      showMarkersAndClusters()
    } else {
      // manually delete them all
      if (!locations) {
        MapService.resetAllMarkers()
      } else {
        showLocations()
      }
    }

    if (!firstTimeLoaded.current) {
      firstTimeLoaded.current = true
      setOpenDrawer(true)
    }
    blurMarker()
  }, [clusters, listings, count, dynamicClustering, listingsTab, locations])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (focusedMarker) {
      prevFocusedMarker.current?.classList.remove('focused')

      if (prevFocusedPolygon.current) {
        MapService.blurPolygon(map, prevFocusedPolygon.current)
        prevFocusedPolygon.current = null
      }

      const element = document.getElementById(focusedMarker)
      if (element) {
        element.classList.add('focused')
        prevFocusedMarker.current = element
      } else {
        // no HTML element found, should be MapBox polygon instead
        MapService.focusPolygon(map, focusedMarker)
        prevFocusedPolygon.current = focusedMarker
      }
    }

    return () => prevFocusedMarker.current?.classList.remove('focused')
  }, [focusedMarker])

  useEffect(() => {
    if (mapVisible && !statisticsTab) mapRef.current?.resize()
  }, [mapVisible, statisticsTab])

  useEffect(() => {
    mapRef.current?.setStyle(getMapStyleUrl(style))
  }, [style])

  useEffect(() => {
    const map = mapRef.current
    const container = mapContainerRef.current

    if (!container) return

    const isMapTabActive = locationsTab || listingsTab

    if (canRenderMap && isMapTabActive) {
      if (!map) initializeMap(container)
      else map.resize()
    } else if (!isMapTabActive) {
      // Don't destroy map when switching tabs, just keep it hidden
    }
  }, [canRenderMap, locationsTab, listingsTab])

  return (
    <Stack spacing={1.5} sx={{ position: 'relative', flex: 1 }}>
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
        <MapClusterWarnings />
        <MapContainer ref={mapContainerRef} />
        {locationsTab && <SearchField />}
        {listingsTab && (
          <MapCounter count={count} loading={loading || !request} />
        )}

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
            bottom: listingsTab && !listingsDisabled && openDrawer ? 116 : 0,
            position: 'absolute'
          }}
        >
          {listingsTab && <MapDrawButton />}
          <MapNavigation />
          <MapStyleSwitch />
          {listingsTab && !listingsDisabled && (
            <CardsCarouselSwitch
              open={openDrawer}
              onClick={() => setOpenDrawer(!openDrawer)}
            />
          )}
        </Stack>
        {centerPoint && <MapCenterPoint />}
      </Box>
      {listingsTab && <CardsCarousel open={openDrawer && !listingsDisabled} />}
    </Stack>
  )
}

export default MapRoot
