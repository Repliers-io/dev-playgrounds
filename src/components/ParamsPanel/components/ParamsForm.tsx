import { useEffect, useMemo } from 'react'
import merge from 'deepmerge'
import queryString from 'query-string'
import { FormProvider, useForm } from 'react-hook-form'

import { joiResolver } from '@hookform/resolvers/joi'
import { Box, Button, Stack } from '@mui/material'

import ParamsMultiselect from 'components/ParamsPanel/components/ParamsMultiselect.tsx'

import { useAllowedFieldValues } from 'providers/AllowedFieldValuesProvider.tsx'
import { useMapOptions } from 'providers/MapOptionsProvider.tsx'
import { useSearch } from 'providers/SearchProvider'
import {
  defaultClusterChangeStep,
  defaultClusterLimit,
  defaultClusterPrecision
} from 'constants/search.ts'

import schema from '../schema'
import {
  classOptions,
  sortByOptions,
  statusOptions,
  trueFalseOptions,
  typeOptions
} from '../types'
import { formatBooleanFields, formatMultiselectFields } from '../utils.ts'

import ParamsCheckbox from './ParamsCheckbox.tsx'
import ParamsField from './ParamsField'
import ParamsRange from './ParamsRange.tsx'
import ParamsSection from './ParamsSection'
import ParamsSelect from './ParamsSelect'

const apiUrl = process.env.REACT_APP_REPLIERS_API_URL || ''
const apiKey = process.env.REACT_APP_REPLIERS_KEY || ''

type FormData = {
  // Internal use only: manages cluster/marker view on the UI
  // Exclude from request parameters
  clusterAutoSwitch: boolean

  // Internal use only: examplifies sliding cluster precision bazed on zool level
  // Exclude from request parameters
  slidingClusterPrecision: boolean

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
  cluster: boolean | null
  clusterLimit: number | null
  clusterPrecision: number | null
}

const defaultFormState: FormData = {
  // internal usage only
  clusterAutoSwitch: true,
  slidingClusterPrecision: true,

  // request parameters
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
  minParkingSpaces: null,
  cluster: null,
  clusterLimit: null,
  clusterPrecision: null
}

const processSubmitFormData = (data: FormData) => {
  const { cluster, ...rest } = data

  // remove cluster manually for exclude it from query params
  if (cluster === false) {
    return rest
  }

  return data
}

const ParamsForm = () => {
  const { propertyTypeOptions, styleOptions, lastStatusOptions } =
    useAllowedFieldValues()
  const { setParams, params: localStorageParams, setParam } = useSearch()

  const { position } = useMapOptions()

  const multiselectFields = [
    'propertyType',
    'style',
    'type',
    'lastStatus',
    'status',
    'class'
  ] as const

  // cache them one time on first render
  const params = useMemo(() => {
    const parsed = queryString.parse(window.location.search)
    const formatedFields = formatBooleanFields(parsed)
    return formatMultiselectFields(formatedFields, multiselectFields)
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lng, lat, zoom, ...apiParams } = params
  const mergedApiParams = { ...localStorageParams, ...apiParams }
  const defaultValues = merge(defaultFormState, mergedApiParams)

  const methods = useForm<FormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur', // Re-validate on blur
    shouldFocusError: false, // Do not auto-focus on errors
    defaultValues,
    resolver: joiResolver(schema, { allowUnknown: true })
  })

  const { handleSubmit, watch, setValue } = methods
  const clusterEnabled = watch('cluster')
  const slidingClusterPrecision = watch('slidingClusterPrecision')

  const onSubmit = (data: FormData) => {
    const formParams = processSubmitFormData(data)
    localStorage.setItem('params', JSON.stringify(formParams))
    setParams(formParams as any)
  }

  const onError = (errors: any) => {
    console.error('validation errors:', errors)
  }

  const handleChange = () => {
    handleSubmit(onSubmit, onError)()
  }

  const handleClear = (currentValues = methods.getValues()) => {
    const { apiUrl, apiKey } = currentValues
    methods.reset({
      ...defaultFormState,
      apiUrl,
      apiKey
    })
    handleSubmit(onSubmit, onError)()
  }

  const handleResetCluster = (currentValues: Partial<FormData>) => {
    methods.reset({
      ...currentValues,
      cluster: null,
      clusterAutoSwitch: false,
      slidingClusterPrecision: false,
      clusterLimit: null,
      clusterPrecision: null
    })
    handleSubmit(onSubmit, onError)()
  }

  const handleRestoreCluster = (currentValues: Partial<FormData>) => {
    methods.reset({
      ...currentValues,
      cluster: true,
      clusterAutoSwitch: true,
      slidingClusterPrecision: true,
      clusterLimit: defaultClusterLimit,
      clusterPrecision: defaultClusterPrecision
    })
    handleSubmit(onSubmit, onError)()
  }

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      const { cluster } = value
      // reset/restore cluster fields if cluster changed
      if (name === 'cluster') {
        if (cluster === false) {
          handleResetCluster(value as FormData)
        } else if (cluster === true) {
          handleRestoreCluster(value as FormData)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    handleSubmit(onSubmit, onError)()
  }, [])

  useEffect(() => {
    if (slidingClusterPrecision) {
      setParam('clusterPrecision', Math.round(position?.zoom || 0) + 2)
      setValue('clusterPrecision', Math.round(position?.zoom || 0) + 2)
    }
  }, [position?.zoom, slidingClusterPrecision])

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
                onClick={() => handleClear()}
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
                <ParamsSelect
                  name="listings"
                  options={trueFalseOptions}
                  onChange={handleChange}
                />
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
          <ParamsSection
            title="Clusters"
            hint="docs"
            link="https://help.repliers.com/en/article/map-clustering-implementation-guide-1c1tgl6/#3-requesting-clusters"
            sx={{ '& .MuiStack-root > .MuiStack-root': { pb: 0 } }}
            rightSlot={
              <ParamsCheckbox
                name="cluster"
                label="Enable"
                size="small"
                onChange={handleChange}
              />
            }
          >
            <Stack spacing={1.25}>
              <Stack mx="-11px">
                <ParamsCheckbox
                  name="clusterAutoSwitch"
                  label="Auto-Switch off clusters on Map"
                  size="small"
                  disabled={!clusterEnabled}
                  onChange={handleChange}
                />
                <ParamsCheckbox
                  name="slidingClusterPrecision"
                  label="Sliding Cluster Precision"
                  size="small"
                  disabled={!clusterEnabled}
                  onChange={handleChange}
                />
              </Stack>
              <ParamsRange
                name="clusterLimit"
                max={200}
                min={0}
                step={defaultClusterChangeStep}
                disabled={!clusterEnabled}
                onMouseUp={handleChange}
              />
              <ParamsRange
                name="clusterPrecision"
                max={29}
                min={0}
                step={defaultClusterChangeStep}
                disabled={!clusterEnabled}
                onMouseUp={handleChange}
              />
            </Stack>
          </ParamsSection>
        </Stack>
      </form>
    </FormProvider>
  )
}

export default ParamsForm
