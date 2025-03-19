import { useState } from 'react'
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

import {
  BoundsSection,
  ClustersSection,
  CredentialsSection,
  QueryParamsSection,
  StatisticsSection
} from './sections'
import { filterQueryParams } from './utils'

const warningMessageListingsDisabled =
  "Set listings to 'true' to view listings on the map"
const warningMessageClusteringThreshold =
  "Set listings to 'true' to view listings at street level"

const ParamsPanel = () => {
  const { search, count, params, polygon } = useSearch()
  const { apiKey } = params
  const { canRenderMap, position } = useMapOptions()
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null)

  const fetchData = async (
    position: MapPosition,
    params: Partial<FormParams>,
    polygon: Position[] | null
  ) => {
    const { bounds, center, zoom } = position
    const { lng, lat } = center || {}
    const query = queryString.stringify(
      { lng, lat, zoom, ...params },
      queryStringOptions
    )
    window.history.pushState(null, '', `?${query}`)

    const { grp, stats, statistics } = params
    const filteredParams = filterQueryParams(params)

    // WARN: additional parameters modifications for statistics
    // adding grouping parameter at the end of the statistics array
    if (stats && grp && statistics) {
      filteredParams.statistics = statistics + ',' + grp
    }

    try {
      const fetchBounds = polygon
        ? getMapPolygon(polygon)
        : getMapRectangle(bounds!)

      await search({
        ...filteredParams,
        ...fetchBounds
      })
    } catch (error: any) {
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
  }, [position, apiKey, params, polygon, canRenderMap])

  return (
    <Box
      sx={{
        flex: 1,
        pr: 1.75,
        mr: -1.75,
        width: 280,
        height: '100%',
        display: 'flex',
        overflow: 'auto',
        scrollbarWidth: 'thin',
        flexDirection: 'column'
      }}
    >
      <Stack spacing={1}>
        <Stack spacing={1} sx={{ pt: '3px' }}>
          <CredentialsSection />
          <QueryParamsSection />
          <StatisticsSection />
          <ClustersSection />
          <BoundsSection />
        </Stack>
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
