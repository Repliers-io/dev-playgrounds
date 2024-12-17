import { useEffect } from 'react'
import { type Position } from 'geojson'
import type { LngLatBounds } from 'mapbox-gl'
import queryString from 'query-string'

import { Box, Stack } from '@mui/material'

import type { ApiLocation, Property } from 'services/API/types.ts'
import { type MapPosition } from 'services/Map/types'
import { getMapPolygon, getMapRectangle } from 'services/Search'
import { useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'
import useDeepCompareEffect from 'hooks/useDeepCompareEffect'
import { apiFetch, queryStringOptions } from 'utils/api'
import { calcZoomLevelForBounds, getPolygonBounds } from 'utils/map.ts'
import { mapboxDefaults } from 'constants/map.ts'

import BoundsForm from './components/BoundsForm'
import ParamsForm from './components/ParamsForm'

const getLocations = (listings: Property[]) => {
  return listings.map((item: Property) => ({
    lat: parseFloat(item.map.latitude),
    lng: parseFloat(item.map.longitude)
  }))
}

const getMapContainerSize = (container: HTMLElement | null) => {
  return container
    ? { width: container.clientWidth, height: container.clientHeight }
    : null
}

const getMapZoom = (bounds: LngLatBounds, container: HTMLElement | null) => {
  const size = getMapContainerSize(container)
  return size
    ? calcZoomLevelForBounds(bounds, size.width, size.height)
    : mapboxDefaults.zoom!
}

const getMapPosition = (
  locations: ApiLocation[],
  container: HTMLElement | null
) => {
  const bounds = getPolygonBounds(locations)
  const center = bounds.getCenter()
  const zoom = getMapZoom(bounds, container)
  return { bounds, center, zoom }
}

const fetchLocations = async ({
  apiKey,
  apiUrl
}: {
  apiKey: string
  apiUrl: string
}) => {
  try {
    const response = await apiFetch(
      `${apiUrl}/listings`,
      { get: { fields: 'map' } },
      {
        headers: { 'REPLIERS-API-KEY': apiKey }
      }
    )
    if (!response.ok) {
      throw new Error('[fetchLocations]: could not fetch locations')
    }

    const { listings } = await response.json()
    return getLocations(listings)
  } catch (error) {
    console.error(error)
    return null
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
  const { search, params, polygon, clearData } = useSearch()

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

  // subscribe for apiKey changes must refetch listings, calculate new position and reinitialize map
  useEffect(() => {
    const { apiKey = '', apiUrl = '' } = params
    if (!apiKey || !apiUrl || !mapContainerRef.current) return

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
        <ParamsForm />
        <BoundsForm />
      </Stack>
    </Box>
  )
}

export default ParamsPanel
