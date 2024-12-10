import { type Position } from 'geojson'

import { Box, Stack, Typography } from '@mui/material'

import {
  type Filters,
  getDefaultRectangle,
  getMapPolygon,
  getMapRectangle
} from 'services/Search'
import { type MapPosition, useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'
import useDeepCompareEffect from 'hooks/useDeepCompareEffect'

import ParamsForm from './ParamsForm'
const OptionsPanel = () => {
  const { position } = useMapOptions()
  const { search, params, polygon } = useSearch()

  const fetchData = async (
    position: MapPosition,
    Params: Filters,
    polygon: Position[] | null
  ) => {
    const { bounds } = position

    const fetchBounds = polygon
      ? getMapPolygon(polygon)
      : bounds
        ? getMapRectangle(bounds)
        : getDefaultRectangle()

    try {
      const json = await search({
        ...params,
        ...fetchBounds
        // ...getPageParams(),
        // ...getListingFields()
        // ...getClusterParams(zoom)
      })

      console.log('response', json)
    } catch (error) {
      console.error('fetchData error:', error)
    }
    //   // MapService.update(list, clusters, count)
  }

  useDeepCompareEffect(() => {
    if (!position.bounds) return
    if (!params || !Object.keys(params).length) return
    console.log('params', params)
    fetchData(position, params, polygon) // polygon is an optional parameter for future implementation
  }, [position.bounds, params])

  return (
    <Box
      sx={{
        width: 280
      }}
    >
      <Stack spacing={1}>
        <Typography variant="h6" fontSize="12px" textTransform="uppercase">
          Query Parameters
        </Typography>
        <Box
          sx={{
            p: 1.25,
            width: '100%',
            boxSizing: 'border-box',
            bgcolor: 'background.default',
            overflow: 'hidden',
            border: 1,
            borderRadius: 2,
            borderColor: '#eee'
            // boxShadow: 1
          }}
        >
          <ParamsForm />
        </Box>
      </Stack>
    </Box>
  )
}

export default OptionsPanel
