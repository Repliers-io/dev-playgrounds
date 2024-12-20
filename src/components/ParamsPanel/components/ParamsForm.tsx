import { useEffect, useMemo } from 'react'
import merge from 'deepmerge'
import queryString from 'query-string'
import { FormProvider, useForm } from 'react-hook-form'

import { joiResolver } from '@hookform/resolvers/joi'
import { Box, Button, Stack } from '@mui/material'

import ParamsMultiselect from 'components/ParamsPanel/components/ParamsMultiselect.tsx'

import { useAllowedFieldValues } from 'providers/AllowedFieldValuesProvider.tsx'
import { useSearch } from 'providers/SearchProvider'

import schema from '../schema'
import {
  classOptions,
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
  const { propertyTypeOptions, styleOptions, lastStatusOptions } =
    useAllowedFieldValues()
  const { setParams } = useSearch()
  // cache them one time on first render
  const params = useMemo(() => queryString.parse(window.location.search), [])
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lng, lat, zoom, ...apiParams } = params
  const defaultValues = useMemo(() => {
    const convertToArray = (value: any) => {
      if (value === null || value === undefined) {
        return []
      }
      return typeof value === 'string' ? [value] : value
    }

    return merge(
      {
        apiKey,
        apiUrl,
        boardId: null,
        class: [],
        status: [],
        lastStatus: [],
        type: [],
        style: [],
        propertyType: [],
        sortBy: '',
        minPrice: null,
        maxPrice: null,
        minBedrooms: null,
        minBaths: null,
        minGarageSpaces: null,
        minParkingSpaces: null
      },
      {
        ...apiParams,

        // TODO: maybe exist a better way to do this, need to check
        // force transform query string single values to arrays
        // for prevent crash multi-select rendering with single value after reload page
        propertyType: convertToArray(apiParams.propertyType),
        style: convertToArray(apiParams.style),
        type: convertToArray(apiParams.type),
        lastStatus: convertToArray(apiParams.lastStatus),
        status: convertToArray(apiParams.status),
        class: convertToArray(apiParams.class)
      }
    )
  }, [])

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

  const handleClear = () => {
    methods.reset({
      ...defaultValues,
      // TODO: maybe exist a better way to do this ???
      // force reset params and cashed values(query string)
      boardId: null,
      class: [],
      status: [],
      lastStatus: [],
      type: [],
      style: [],
      propertyType: [],
      sortBy: '',
      minPrice: null,
      maxPrice: null,
      minBedrooms: null,
      minBaths: null,
      minGarageSpaces: null,
      minParkingSpaces: null
    })
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
          <ParamsSection
            title="credentials"
            rightSlot={
              <Button
                type="submit"
                size="small"
                variant="text"
                sx={{
                  mb: 1,
                  height: 32
                }}
                onClick={handleClear}
              >
                Clear All
              </Button>
            }
          >
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

                <ParamsSelect
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
                  name="style"
                  options={styleOptions}
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

                <ParamsMultiselect
                  name="propertyType"
                  options={propertyTypeOptions}
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
