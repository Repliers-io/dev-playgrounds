import { useCallback } from 'react'
import { type Position } from 'geojson'
import queryString from 'query-string'

import { Box, Stack } from '@mui/material'

import { type MapPosition } from 'services/Map/types'
import { getMapPolygon, getMapRectangle } from 'services/Search'
import { useListing } from 'providers/ListingProvider'
import { useLocations } from 'providers/LocationsProvider'
import { useMapOptions } from 'providers/MapOptionsProvider'
import { type FormParams } from 'providers/ParamsFormProvider'
import { useSearch } from 'providers/SearchProvider'
import useDeepCompareEffect from 'hooks/useDeepCompareEffect'
import { queryStringOptions } from 'utils/api'

import {
  BoundsSection,
  CenterRadiusSection,
  ClustersSection,
  CredentialsSection,
  ExamplesTemplate,
  ImageSection,
  ListingParamsSection,
  LocationParamsSection,
  ParamsPresets,
  QueryParamsSection,
  SearchSection,
  StatisticsSection
} from './sections'
import {
  filterLocationsParams,
  filterQueryParams,
  filterSearchParams,
  getCenterPoint
} from './utils'

const ParamsPanel = () => {
  const searchContext = useSearch()
  const listingContext = useListing()
  const locationsContext = useLocations()
  const { params, polygon } = searchContext
  const { apiKey, tab } = params
  const { canRenderMap, position } = useMapOptions()
  const locationsMap = tab === 'locations'
  const listingTab = tab === 'listing'

  // TODO: add polygon to url
  const updateUrlState = useCallback(
    (position: MapPosition, params: Partial<FormParams>) => {
      const { center, zoom } = position
      const { lng, lat } = center || {}

      // Filter out POST-only fields from URL params
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { imageSearchItems, ...urlParams } = params

      const query = queryString.stringify(
        { lng, lat, zoom, ...urlParams },
        queryStringOptions
      )
      window.history.pushState(null, '', `?${query}`)
    },
    []
  )

  const fetchData = useCallback(
    async (
      position: MapPosition,
      params: Partial<FormParams>,
      polygon: Position[] | null
    ) => {
      const { bounds } = position

      // Don't fetch if neither bounds nor polygon are available
      if (!bounds && !polygon) return

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

        // Call the search function from the context
        await searchContext.search({
          ...filteredParams,
          ...fetchBounds
        })
      } catch (error: any) {
        console.error('fetchData error:', error)
      }
    },
    []
  )

  const fetchLocations = useCallback(
    async (position: MapPosition, params: Partial<FormParams>) => {
      const searchParams = filterSearchParams(params)
      const locationsParams = filterLocationsParams(params)

      const locationsEndpoint = params.endpoint === 'locations'
      if (!locationsEndpoint && !searchParams.search) return // disable empty `search` requests

      try {
        await locationsContext.search({
          ...searchParams,
          ...locationsParams,
          ...getCenterPoint(params, position)
        })
      } catch (error: any) {
        console.error('fetchLocations error:', error)
      }
    },
    []
  )

  const fetchProperty = useCallback(async (params: Partial<FormParams>) => {
    const { mlsNumber, listingBoardId, listingFields, apiKey, apiUrl } = params

    // Only search if we have at least mlsNumber or listingBoardId
    if (!mlsNumber && !listingBoardId) return

    try {
      await listingContext.search({
        mlsNumber,
        listingBoardId,
        listingFields,
        apiKey,
        apiUrl,
        endpoint: 'property'
      })
    } catch (error: any) {
      console.error('fetchProperty error:', error)
    }
  }, [])

  useDeepCompareEffect(() => {
    if (!canRenderMap) return
    if (!params || !Object.keys(params).length) return

    // ALWAYS update URL with position and params
    if (position) {
      updateUrlState(position, params)
    }

    // THEN execute tab-specific logic
    if (listingTab) {
      fetchProperty(params)
    } else if (position) {
      if (locationsMap) {
        // we should NOT react on polygon changes when in locationsMap mode
        fetchLocations(position, params)
      } else {
        fetchData(position, params, polygon)
      }
    }
  }, [
    position,
    apiKey,
    params,
    polygon,
    canRenderMap,
    locationsMap,
    listingTab
  ])

  return (
    <Box
      sx={{
        flex: 1,
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
          {listingTab ? (
            <ListingParamsSection />
          ) : !locationsMap ? (
            <>
              <ParamsPresets />
              <QueryParamsSection />
              <ImageSection />
              <LocationParamsSection />
              <StatisticsSection />
              <ClustersSection />
            </>
          ) : (
            <>
              <SearchSection />
              <CenterRadiusSection />
            </>
          )}
          {!listingTab && <BoundsSection />}
        </Stack>
      </Stack>
    </Box>
  )
}

export default ParamsPanel
