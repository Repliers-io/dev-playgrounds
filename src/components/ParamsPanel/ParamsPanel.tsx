import { type Position } from 'geojson'

import { Box } from '@mui/material'

import {
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
    //   // MapService.update(list, clusters, count)
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
        width: 280
      }}
    >
      <ParamsForm />
    </Box>
  )
}

export default OptionsPanel
