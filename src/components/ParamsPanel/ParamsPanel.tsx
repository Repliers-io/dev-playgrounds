import { type Position } from 'geojson'

import { Box, Stack } from '@mui/material'

import {
  getDefaultRectangle,
  getMapPolygon,
  getMapRectangle
} from 'services/Search'
import { type MapPosition, useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'
import useDeepCompareEffect from 'hooks/useDeepCompareEffect'

import BoundsForm from './components/BoundsForm'
import ParamsForm from './components/ParamsForm'

const OptionsPanel = () => {
  const { position } = useMapOptions()
  const { search, params, polygon } = useSearch()

  const fetchData = async (
    position: MapPosition,
    params: any,
    polygon: Position[] | null
  ) => {
    const { bounds } = position

    const fetchBounds = polygon
      ? getMapPolygon(polygon)
      : bounds
        ? getMapRectangle(bounds)
        : getDefaultRectangle()

    try {
      await search({
        ...params,
        ...fetchBounds
        // ...getPageParams(),
        // ...getListingFields()
        // ...getClusterParams(zoom)
      })
    } catch (error) {
      console.error('fetchData error:', error)
    }
  }

  useDeepCompareEffect(() => {
    if (!position.bounds) return
    if (!params || !Object.keys(params).length) return
    // polygon is an optional parameter for future implementation
    fetchData(position, params, polygon)
  }, [position.bounds, params])

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

export default OptionsPanel
