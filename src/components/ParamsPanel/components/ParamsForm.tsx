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
  boardId: number | null
  class: string[]
  status: string[]
  lastStatus: string[]
  type: string[]
  propertyType: string[]
  style: string[]
  sortBy: string
  minPrice: number | null
  maxPrice: number | null
  minBedrooms: number | null
  minBaths: number | null
  minGarageSpaces: number | null
  minParkingSpaces: number | null
}

const defaultFormState: FormData = {
  apiUrl,
  apiKey,
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
}

const ParamsForm = () => {
  const { propertyTypeOptions, styleOptions, lastStatusOptions } =
    useAllowedFieldValues()
  const { setParams } = useSearch()

  const multiselectFields = [
    'propertyType',
    'style',
    'type',
    'lastStatus',
    'status',
    'class'
  ] as const

  // extract and format multiselect fields from query params
  const params = useMemo(() => {
    const parsed = queryString.parse(window.location.search)

    multiselectFields.forEach((field) => {
      const value = parsed[field]
      parsed[field] = !value ? [] : Array.isArray(value) ? value : [value]
    })
    return parsed
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lng, lat, zoom, ...apiParams } = params
  const defaultValues = useMemo(() => merge(defaultFormState, apiParams), [])

  const methods = useForm<FormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur', // Re-validate on blur
    shouldFocusError: false, // Do not auto-focus on errors
    defaultValues,
    resolver: joiResolver(schema, { allowUnknown: true })
  })

  const { handleSubmit, watch } = methods

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
    const { apiUrl: currentApiUrl, apiKey: currentApiKey } = methods.getValues()
    methods.reset({
      ...defaultFormState,
      apiUrl: currentApiUrl,
      apiKey: currentApiKey
    })
    handleSubmit(onSubmit, onError)()
  }

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      const { apiUrl, apiKey } = value
      if (name === 'apiKey' && apiKey !== defaultFormState.apiKey) {
        methods.reset({
          ...defaultFormState,
          apiUrl,
          apiKey
        })
        handleSubmit(onSubmit, onError)()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

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
          <ParamsSection
            title="query parameters"
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
