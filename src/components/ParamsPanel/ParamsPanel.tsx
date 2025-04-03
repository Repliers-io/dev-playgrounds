import { type Position } from 'geojson'
import queryString from 'query-string'

import { Box, Stack } from '@mui/material'

import { type MapPosition } from 'services/Map/types'
import { getMapPolygon, getMapRectangle } from 'services/Search'
import { useMapOptions } from 'providers/MapOptionsProvider'
import { type FormParams, useSearch } from 'providers/SearchProvider'
import useDeepCompareEffect from 'hooks/useDeepCompareEffect'
import { queryStringOptions } from 'utils/api'

import {
  BoundsSection,
  ClustersSection,
  CredentialsSection,
  QueryParamsSection,
  StatisticsSection
} from './sections'
import { filterQueryParams } from './utils'

const ParamsPanel = () => {
  const { search, params, polygon } = useSearch()
  const { apiKey } = params
  const { canRenderMap, position } = useMapOptions()

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
    if (stats && grp?.length && statistics) {
      filteredParams.statistics = statistics + ',' + grp.join(',')
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
        maxWidth: 280,
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
    </Box>
  )
}

export default ParamsPanel
