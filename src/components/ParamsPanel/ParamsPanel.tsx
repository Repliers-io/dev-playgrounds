import { type Position } from 'geojson'
import queryString from 'query-string'

import { Box, Stack } from '@mui/material'

import {
  getDefaultRectangle,
  getMapPolygon,
  getMapRectangle
} from 'services/Search'
import { type MapPosition, useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'
import useDeepCompareEffect from 'hooks/useDeepCompareEffect'
import { queryStringOptions } from 'utils/api'

import BoundsForm from './components/BoundsForm'
import ParamsForm from './components/ParamsForm'

const ParamsPanel = () => {
  const { loaded, position } = useMapOptions()
  const { search, params, polygon } = useSearch()

  const fetchData = async (
    position: MapPosition,
    params: any,
    polygon: Position[] | null
  ) => {
    const { bounds, center, zoom } = position

    const fetchBounds = polygon
      ? getMapPolygon(polygon)
      : bounds
        ? getMapRectangle(bounds)
        : getDefaultRectangle()

    try {
      await search({
        ...params,
        ...fetchBounds
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { apiKey, ...rest } = params
      const { lng, lat } = center || {}

      const query = queryString.stringify(
        { lng, lat, zoom, ...rest },
        queryStringOptions
      )

      window.history.pushState(null, '', `?${query}`)
    } catch (error) {
      console.error('fetchData error:', error)
    }
  }

  useDeepCompareEffect(() => {
    if (!loaded) return
    if (!position.bounds) return
    if (!params || !Object.keys(params).length) return
    // polygon is an optional parameter for future implementation
    fetchData(position, params, polygon)
  }, [loaded, position.bounds, params])

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
        <BoundsForm />
      </Stack>
    </Box>
  )
}

export default ParamsPanel
