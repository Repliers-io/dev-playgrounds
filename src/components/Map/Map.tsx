import { useEffect, useRef, useState } from 'react'
import { Map as MapboxMap } from 'mapbox-gl'

import { Box, Stack } from '@mui/material'

import { type Listing } from 'services/API/types'
import MapService from 'services/Map'
import { useLocations } from 'providers/LocationsProvider'
import { useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'
import useDeepCompareEffect from 'hooks/useDeepCompareEffect'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import { getMapStyleUrl } from 'utils/map'
import {
  mapboxDefaults,
  mapboxToken,
  markersClusteringThreshold
} from 'constants/map'

import {
  CardsCarousel,
  CardsCarouselSwitch,
  MapCenterPoint,
  MapContainer,
  MapCounter,
  MapDrawButton,
  MapNavigation,
  MapSnackbar,
  MapStyleSwitch,
  SearchField
} from './components'

const warningMessageListingsDisabled =
  "Set `listings=true' to view listings on the map."
const warningMessageClusteringThreshold =
  "Set `listings=true' to view listings at street level."

const MapRoot = () => {
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
  const { locations } = useLocations()
  const { request, count, listings, loading, clusters, params } = useSearch()
  const [openDrawer, setOpenDrawer] = useState(false)
  const firstTimeLoaded = useRef(false)
  const { dynamicClustering } = params

  const listingsDisabled = params.listings === 'false'

  const locationsTab = params.tab === 'locations'
  const statisticsTab = params.tab === 'stats'
  const listingsTab = params.tab === 'map'

  const centerPoint = params.center

  const [snackbarMessage, setSnackbarMessage] = useState('')

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
        listings,
        onClick: (listing: Listing) => {
          focusMarker(listing.mlsNumber)
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
        listings: locations.map((location) => {
          const markerId =
            location.locationId + '-' + (location.map.boundary?.length || 0)
          return {
            size: 'location',
            mlsNumber: markerId,
            label: location.name,
            map: location.map
          } as any
        })
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
    if (mapVisible && !statisticsTab) mapRef.current?.resize()
  }, [mapVisible, statisticsTab])

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

  useDeepCompareEffect(() => {
    // default state of the (empty/non-existing) `listings` is true
    const listingsParam = params.listings === 'false' ? false : true

    if (listingsParam) {
      // listings=true
      setSnackbarMessage('')
    } else {
      // listings=false
      if (
        params.dynamicClustering &&
        count > 0 &&
        count < markersClusteringThreshold
      ) {
        setSnackbarMessage(warningMessageClusteringThreshold)
      } else if (!params.cluster) {
        setSnackbarMessage(warningMessageListingsDisabled)
      } else {
        setSnackbarMessage('')
      }
    }
  }, [count, params])

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
        <MapSnackbar message={snackbarMessage} />
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
            bottom: listingsTab && !listingsDisabled && openDrawer ? 100 : 0,
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
