import { useEffect, useMemo } from 'react'
import merge from 'deepmerge'
import queryString from 'query-string'
import { FormProvider, useForm } from 'react-hook-form'

import { joiResolver } from '@hookform/resolvers/joi'
import { Box, Stack } from '@mui/material'

import ParamsMultiselect from 'components/ParamsPanel/components/ParamsMultiselect.tsx'

import { useSearch } from 'providers/SearchProvider'

import schema from '../schema'
import {
  classOptions,
  lastStatusOptions,
  sortByOptions,
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
  minBedrooms: number | null
  minBaths: number | null
  minGarageSpaces: number | null
  minParkingSpaces: number | null
}

const ParamsForm = () => {
  const { setParams } = useSearch()
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
          class: [],
          status: [],
          lastStatus: [],
          type: [],
          propertyType: '',
          sortBy: [],
          minPrice: null,
          maxPrice: null,
          minBedrooms: null,
          minBaths: null,
          minGarageSpaces: null,
          minParkingSpaces: null
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

  const onSubmit = (data: FormData) => {
    setParams(data as any)
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

                <ParamsMultiselect
                  name="sortBy"
                  hint="docs"
                  link="https://github.com/Repliers-io/api-types.ts/blob/main/types/index.ts#L108"
                  options={sortByOptions}
                  onChange={handleChange}
                />

                <ParamsMultiselect
                  name="type"
                  options={typeOptions}
                  onChange={handleChange}
                />

                <ParamsMultiselect
                  name="class"
                  options={classOptions}
                  onChange={handleChange}
                />

                <ParamsMultiselect
                  name="status"
                  options={statusOptions}
                  onChange={handleChange}
                />

                <ParamsMultiselect
                  name="lastStatus"
                  options={lastStatusOptions}
                  hint="docs"
                  link="https://help.repliers.com/en/article/laststatus-definitions-8mokhu/"
                  onChange={handleChange}
                />

                {/* TODO: Make Multi-Select */}
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
