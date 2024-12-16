import React, { useEffect, useMemo } from 'react'
import merge from 'deepmerge'
import type { LngLatBounds } from 'mapbox-gl'
import queryString from 'query-string'
import { FormProvider, useForm } from 'react-hook-form'

import { joiResolver } from '@hookform/resolvers/joi'
import { Box, Stack } from '@mui/material'

import { type ApiLocation, type Property } from 'services/API/types.ts'
import { useMapOptions } from 'providers/MapOptionsProvider.tsx'
import { useSearch } from 'providers/SearchProvider'
import {
  calcZoomLevelForBounds,
  getPolygonBounds,
  updateMapboxPosition
} from 'utils/map.ts'
import { mapboxDefaults } from 'constants/map.ts'

import schema from '../schema'
import {
  classOptions,
  lastStatusOptions,
  statusOptions,
  typeOptions
} from '../types'

import ParamsField from './ParamsField'
import ParamsSection from './ParamsSection'
import ParamsSelect from './ParamsSelect'

const apiUrl = process.env.REACT_APP_REPLIERS_API_URL || ''
const apiKey = process.env.REACT_APP_REPLIERS_KEY || ''

type FormData = {
  apiUrl: string
  apiKey: string
  boardId: number
  class: string | string[]
  status: string
  lastStatus: string
  type: string | string[]
  propertyType: string | string[]
  sortBy: string
  minPrice: number | null
  maxPrice: number | null
}

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

const ParamsForm = () => {
  const { setPosition, mapContainerRef, mapRef } = useMapOptions()
  const { setParams, search } = useSearch()
  // cache them one time on first render
  const params = useMemo(() => queryString.parse(window.location.search), [])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lng, lat, zoom, ...apiParams } = params
  const defaultValues = useMemo(
    () =>
      merge(
        {
          apiKey,
          apiUrl,
          boardId: null,
          class: '',
          status: '',
          lastStatus: '',
          type: '',
          propertyType: '',
          sortBy: '',
          minPrice: null,
          maxPrice: null
        },
        // cache them one time on first render
        apiParams
      ),
    []
  )

  const methods = useForm<FormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur', // Re-validate on blur
    shouldFocusError: false, // Do not auto-focus on errors
    defaultValues,
    resolver: joiResolver(schema, { allowUnknown: true })
  })
  const { handleSubmit } = methods

  const onSubmit = async (data: FormData) => {
    setParams(data as any)

    // load listings for calculate bounds/center/zoom, need only once
    const { listings = [] } = (await search(data)) ?? {}

    // set bounds/center/zoom from listings
    if (listings.length) {
      const { bounds, center, zoom } = getMapPosition(
        getLocations(listings),
        mapContainerRef.current
      )

      setPosition({ bounds, center, zoom })
      updateMapboxPosition(mapRef.current, { bounds, center, zoom })
    }
  }

  const onError = (errors: any) => {
    console.error('validation errors:', errors)
  }

  const handleChange = () => {
    handleSubmit(onSubmit, onError)()
  }

  useEffect(() => {
    handleSubmit(onSubmit, onError)()
  }, [])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Stack
          spacing={1}
          alignItems="flex-start"
          justifyContent="stretch"
          height="100%"
        >
          <ParamsSection title="credentials">
            <Stack spacing={1}>
              <ParamsField
                noClear
                name="apiKey"
                hint="* HTTP Header"
                label="REPILERS-API-KEY"
                onChange={handleChange}
              />
              <ParamsField name="apiUrl" noClear onChange={handleChange} />
            </Stack>
          </ParamsSection>
          <ParamsSection title="query parameters">
            <Box
              sx={{
                pr: 1,
                width: '100%',
                overflow: 'auto',
                scrollbarWidth: 'thin'
              }}
            >
              <Stack spacing={1.25}>
                <ParamsField name="boardId" noClear onChange={handleChange} />
                <Stack
                  spacing={1}
                  direction="row"
                  justifyContent="space-between"
                >
                  <ParamsField
                    name="pageNum"
                    hint="docs"
                    link="https://help.repliers.com/en/article/searching-filtering-and-pagination-guide-1q1n7x0/#3-pagination"
                    onChange={handleChange}
                  />
                  <ParamsField name="resultsPerPage" onChange={handleChange} />
                </Stack>
                <ParamsField
                  name="sortBy"
                  hint="docs"
                  link="https://github.com/Repliers-io/api-types.ts/blob/main/types/index.ts#L108"
                  onChange={handleChange}
                />

                <ParamsSelect
                  name="type"
                  options={
                    [
                      ...typeOptions
                    ] /* WARN: `options` prop doesnt allow to pass readonly arrays, they should be mutable */
                  }
                  onChange={handleChange}
                />
                <ParamsSelect
                  name="class"
                  options={[...classOptions]}
                  onChange={handleChange}
                />
                <ParamsSelect
                  name="status"
                  options={[...statusOptions]}
                  onChange={handleChange}
                />
                <ParamsSelect
                  name="lastStatus"
                  options={[...lastStatusOptions]}
                  hint="docs"
                  link="https://help.repliers.com/en/article/laststatus-definitions-8mokhu/"
                  onChange={handleChange}
                />

                <ParamsField
                  name="propertyType"
                  hint="docs"
                  link="https://help.repliers.com/en/article/using-aggregates-to-determine-acceptable-values-for-filters-c88csc/#6-determining-acceptable-values"
                  onChange={handleChange}
                />
                <Stack
                  spacing={1}
                  direction="row"
                  justifyContent="space-between"
                >
                  <ParamsField name="minPrice" onChange={handleChange} />
                  <ParamsField name="maxPrice" onChange={handleChange} />
                </Stack>
                <Stack
                  spacing={1}
                  direction="row"
                  justifyContent="space-between"
                >
                  <ParamsField name="minBedrooms" onChange={handleChange} />
                  <ParamsField name="minBaths" onChange={handleChange} />
                </Stack>
                <Stack
                  spacing={1}
                  direction="row"
                  justifyContent="space-between"
                >
                  <ParamsField name="minGarageSpaces" onChange={handleChange} />
                  <ParamsField
                    name="minParkingSpaces"
                    onChange={handleChange}
                  />
                </Stack>
              </Stack>
            </Box>
          </ParamsSection>
        </Stack>
      </form>
    </FormProvider>
  )
}

export default ParamsForm
