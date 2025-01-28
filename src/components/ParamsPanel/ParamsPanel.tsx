import { useEffect, useState } from 'react'
import { type Position } from 'geojson'
import queryString from 'query-string'

import { Box, Stack } from '@mui/material'
import { Alert, Snackbar } from '@mui/material'

// why APIH..., but ApiL... names??? why didnt we export them from API module?
import { type APIHost, type ApiLocation } from 'services/API/types'
import MapService from 'services/Map'
// enum shouldnt be exported from TYPES, and types shouldnt even be the point of export, but the module itself!
import { MapDataMode, type MapPosition } from 'services/Map/types'
import { getMapPolygon, getMapRectangle } from 'services/Search'
import { AllowedFieldValuesProvider } from 'providers/AllowedFieldValuesProvider'
import { useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'
import useDeepCompareEffect from 'hooks/useDeepCompareEffect'
import { apiFetch, queryStringOptions } from 'utils/api'
import { markersClusteringThreshold } from 'constants/map'

import BoundsForm from './components/BoundsForm'
import ParamsForm from './components/ParamsForm'
import { getLocations, getMapPosition } from './utils'

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
    setCanRenderMap
  } = useMapOptions()
  const { search, count, params, polygon, clearData } = useSearch()
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null)

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

      // TODO: FIXME: `params.cluster` SHOULD NOT be part of the API query
      const response = await search({
        ...filteredParams,
        ...fetchBounds
      })

      if (!response) return

      const { listings, count, aggregates } = response
      const { clusters = [] } = aggregates?.map || {}

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { apiKey, cluster, ...rest } = params
      const { lng, lat } = center || {}

      const query = queryString.stringify(
        { lng, lat, zoom, cluster, ...rest },
        queryStringOptions
      )
      window.history.pushState(null, '', `?${query}`)

      const clusterViewMode = cluster
        ? MapDataMode.CLUSTER // NO ENUMS!
        : MapDataMode.SINGLE_MARKER // NO ENUMS!
      MapService.setViewMode(clusterViewMode)
      MapService.setClusterAutoSwitch(clusterAutoSwitch)
      MapService.update(listings, clusters, count)

    } catch (error) {
      console.error('fetchData error:', error)
    }
  }

  useDeepCompareEffect(() => {
    // default state of the (empty/non-existing) `listings` is true
    const listingsParam = params.listings === 'false' ? false : true

    if (listingsParam) {
      // listings=true
      setSnackbarMessage(null)
    } else {
      // listings=false
      if (
        params.clusterAutoSwitch &&
        count > 0 &&
        count < markersClusteringThreshold
      ) {
        setSnackbarMessage(
          "You don't see listings on the map because of the 'listings=false' flag AND you reached auto clustering threshold"
        )
      } else if (!params.cluster) {
        setSnackbarMessage(
          "You don't see listings on the map because of the 'listings=false' flag"
        )
      } else {
        setSnackbarMessage(null)
      }
    }
  }, [count, params])

  // subscription to apiKey changes must refetch listings
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
      <Snackbar
        open={Boolean(snackbarMessage)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="warning" variant="filled" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ParamsPanel
