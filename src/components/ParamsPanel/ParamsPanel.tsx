import { useEffect, useState } from 'react'
import { type Position } from 'geojson'
import queryString from 'query-string'

import { Box, Stack } from '@mui/material'
import { Alert, Snackbar } from '@mui/material'

import { type MapPosition } from 'services/Map/types'
import { getMapPolygon, getMapRectangle } from 'services/Search'
import { useMapOptions } from 'providers/MapOptionsProvider'
import { type FormParams, useSearch } from 'providers/SearchProvider'
import useDeepCompareEffect from 'hooks/useDeepCompareEffect'
import { queryStringOptions } from 'utils/api'
import { markersClusteringThreshold } from 'constants/map'

import ParamsForm from './components/ParamsForm'
import { filterQueryParams } from './utils'

const warningMessageListingsDisabled =
  "You don't see listings on the map because of the 'listings=false' flag"
const warningMessageClusteringThreshold =
  "You don't see listings on the map because of the 'listings=false' flag AND you reached auto clustering threshold"

const ParamsPanel = () => {
  const { search, count, params, polygon, clearData } = useSearch()
  const { apiKey } = params
  const { canRenderMap, position } = useMapOptions()
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null)

  const fetchData = async (
    position: MapPosition,
    params: Partial<FormParams>,
    polygon: Position[] | null
  ) => {
    const { bounds, center, zoom } = position

    const fetchBounds = polygon
      ? getMapPolygon(polygon)
      : getMapRectangle(bounds!)

    const filteredParams = filterQueryParams(params)

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { apiKey, cluster, ...rest } = params
      const { lng, lat } = center || {}
      const query = queryString.stringify(
        { lng, lat, zoom, cluster, ...rest },
        queryStringOptions
      )
      window.history.pushState(null, '', `?${query}`)

      await search({
        ...filteredParams,
        ...fetchBounds
      })
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
        params.dynamicClustering &&
        count > 0 &&
        count < markersClusteringThreshold
      ) {
        setSnackbarMessage(warningMessageClusteringThreshold)
      } else if (!params.cluster) {
        setSnackbarMessage(warningMessageListingsDisabled)
      } else {
        setSnackbarMessage(null)
      }
    }
  }, [count, params])

  useDeepCompareEffect(() => {
    if (!position) return
    if (!canRenderMap) return
    if (!params || !Object.keys(params).length) return
    fetchData(position, params, polygon)
  }, [position, params, polygon, canRenderMap])

  // subscription to apiKey changes must clear old response
  useEffect(() => {
    if (apiKey) clearData()
  }, [apiKey])

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
        <ParamsForm />
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
