import { useEffect, useState } from 'react'
import { type Position } from 'geojson'
import queryString from 'query-string'

import { Box, Stack } from '@mui/material'

import type { APIHost, ApiLocation } from 'services/API/types'
import MapService, { MAP_CONSTANTS } from 'services/Map'
import { MapDataMode, type MapPosition } from 'services/Map/types'
import { getMapPolygon, getMapRectangle } from 'services/Search'
import { AllowedFieldValuesProvider } from 'providers/AllowedFieldValuesProvider'
import { useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'
import useDeepCompareEffect from 'hooks/useDeepCompareEffect'
import { apiFetch, queryStringOptions } from 'utils/api'

import BoundsForm from './components/BoundsForm'
import ParamsForm from './components/ParamsForm'
import { getLocations, getMapPosition } from './utils.ts'

const fetchLocations = async ({ apiKey, apiUrl }: APIHost) => {
  try {
    const getOptions = { get: { fields: 'map,mlsNumber' } }
    const options = { headers: { 'REPLIERS-API-KEY': apiKey } }
    const response = await apiFetch(`${apiUrl}/listings`, getOptions, options)
    if (!response.ok) {
      throw new Error('[fetchLocations]: could not fetch locations')
    }

    const { listings } = await response.json()
    return getLocations(listings)
  } catch (error) {
    console.error(error)
    throw error
  }
}

const ParamsPanel = () => {
  const {
    canRenderMap,
    position,
    mapContainerRef,
    setPosition,
    setCanRenderMap,
    showSnackbar,
    hideSnackbar
  } = useMapOptions()
  const { search, params, polygon, clearData } = useSearch()

  const { listingCount, setListingCount } = useState(0)

  const savePosition = (
    locations: ApiLocation[],
    mapContainer: HTMLDivElement
  ) => {
    const mapPosition = getMapPosition(locations, mapContainer)
    setPosition(mapPosition)
  }

  const fetchData = async (
    position: MapPosition,
    params: any,
    polygon: Position[] | null
  ) => {
    const { bounds, center, zoom } = position

    const fetchBounds = polygon
      ? getMapPolygon(polygon)
      : getMapRectangle(bounds!)

    try {
      const { clusterAutoSwitch, ...filteredParams } = params

      // const paramsListings =
      //   filteredParams.listings === 'true' || filteredParams.listings === ''

      // const paramsCluster = filteredParams.cluster === true

      const response = await search({
        ...filteredParams,
        ...fetchBounds
      })

      if (!response) return

      const { listings, count, aggregates } = response
      const { clusters = [] } = aggregates?.map || {}
      // setListingCount(count)

      // eslint-disable-next-line no-console
      // console.log('count: ', count)
      // console.log('paramsListings: ', paramsListings)
      // console.log('paramsCluster: ', paramsCluster)
      // console.log('clusterAutoSwitch: ', clusterAutoSwitch)

      // if (paramsListings) {
      //   hideSnackbar()
      // } else {
      //   /* !paramsListings */
      //   if (!paramsCluster) {
      //     showSnackbar(
      //       "You don't see listings on map because 'listngs === false'",
      //       'warning'
      //     )
      //   } else if (
      //     /* paramsCluster */
      //     clusterAutoSwitch &&
      //     count < MAP_CONSTANTS.API_LISTINGS_COUNT_TO_ENABLE_CLUSTERING
      //   ) {
      //     showSnackbar(
      //       "You don't see listings on map because 'listngs === false'",
      //       'warning'
      //     )
      //   } else {
      //     hideSnackbar()
      //   }
      // }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { apiKey, cluster, ...rest } = params
      const { lng, lat } = center || {}

      const query = queryString.stringify(
        { lng, lat, zoom, cluster, ...rest },
        queryStringOptions
      )

      const clusterViewMode = cluster
        ? MapDataMode.CLUSTER
        : MapDataMode.SINGLE_MARKER
      MapService.setViewMode(clusterViewMode)
      MapService.setClusterAutoSwitch(clusterAutoSwitch)
      MapService.update(listings, clusters, count)

      window.history.pushState(null, '', `?${query}`)
    } catch (error) {
      console.error('fetchData error:', error)
    }
  }

  // useEffect(() => {
  //   console.log('useEffect: [params, listingCount]')
  //   const { clusterAutoSwitch, ...filteredParams } = params

  //   const paramsListings =
  //     filteredParams.listings === 'true' || filteredParams.listings === ''
  //   const paramsCluster = filteredParams.cluster === true

  //   if (paramsListings) {
  //     hideSnackbar()
  //   } else {
  //     /* !paramsListings */
  //     if (!paramsCluster) {
  //       showSnackbar(
  //         "You don't see listings on map because 'listngs === false'",
  //         'warning'
  //       )
  //     } else if (
  //       /* paramsCluster */
  //       clusterAutoSwitch &&
  //       listingCount < MAP_CONSTANTS.API_LISTINGS_COUNT_TO_ENABLE_CLUSTERING
  //     ) {
  //       showSnackbar(
  //         "You don't see listings on map because 'listngs === false'",
  //         'warning'
  //       )
  //     } else {
  //       hideSnackbar()
  //     }
  //   }
  // }, [params, listingCount])

  // subscribe for apiKey changes must refetch listings
  // for calculate position/bounds/zoom
  // and clear old response
  useEffect(() => {
    const { apiKey = '', apiUrl = '' } = params
    if (!apiKey || !apiUrl) return

    setCanRenderMap(false)
    clearData()

    fetchLocations({ apiKey, apiUrl }).then((locations) => {
      if (!locations?.length || !mapContainerRef.current) return
      savePosition(locations, mapContainerRef.current)

      setCanRenderMap(true)
    })
  }, [params.apiKey])

  useDeepCompareEffect(() => {
    if (!canRenderMap) return
    if (!position) return
    if (!params || !Object.keys(params).length) return
    // polygon is an optional parameter for future implementation
    fetchData(position, params, polygon)
  }, [position, params, canRenderMap])

  return (
    <Box
      sx={{
        flex: 1,
        maxWidth: 280,
        mr: -1.75,
        pr: 1.75,
        height: '100%',
        display: 'flex',
        overflow: 'auto',
        scrollbarWidth: 'thin',
        flexDirection: 'column'
      }}
    >
      <Stack spacing={1}>
        <AllowedFieldValuesProvider
          apiUrl={params.apiUrl || ''}
          apiKey={params.apiKey || ''}
        >
          <ParamsForm />
        </AllowedFieldValuesProvider>
        <BoundsForm />
      </Stack>
    </Box>
  )
}

export default ParamsPanel
