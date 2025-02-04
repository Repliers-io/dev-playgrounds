import { useEffect, useMemo } from 'react'
import merge from 'deepmerge'
import queryString from 'query-string'
import { type FieldErrors, FormProvider, useForm } from 'react-hook-form'

import { joiResolver } from '@hookform/resolvers/joi'
import { Stack } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import { type FormParams, useSearch } from 'providers/SearchProvider'
import { defaultClusterLimit, defaultClusterPrecision } from 'constants/search'

import defaultFormState from './defaults'
import schema from './schema'
import {
  BoundsSection,
  ClustersSection,
  CredentialsSection,
  QueryParamsSection
} from './sections'
import { type FormData } from './types'
import { formatBooleanFields, formatMultiSelectFields } from './utils'

const ParamsForm = () => {
  const { setParams, params: localStorageParams, setParam } = useSearch()

  const { position } = useMapOptions()

  const multiSelectFields = [
    'type',
    'class',
    'style',
    'status',
    'lastStatus',
    'propertyType'
  ] as const

  //  TODO: form should not have access to window.location.search and do any params parsing
  // cache them one time on first render
  const params = useMemo(() => {
    const parsed = queryString.parse(window.location.search)
    const formatted = formatBooleanFields(parsed)
    const formatted2 = formatMultiSelectFields(formatted, multiSelectFields)
    return formatted2
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lng, lat, zoom, ...apiParams } = params
  const mergedApiParams = { ...localStorageParams, ...apiParams }
  const defaultValues = merge(
    defaultFormState,
    mergedApiParams
  ) as Partial<FormData>

  const methods = useForm<FormData>({
    defaultValues,
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur', // Re-validate on blur
    shouldFocusError: false, // Do not auto-focus on errors
    resolver: joiResolver(schema, { allowUnknown: true })
  })

  const { handleSubmit, trigger, watch, reset, getValues, setValue } = methods

  const clusterEnabled = watch('cluster')
  const slidingClusterPrecision = watch('slidingClusterPrecision')

  const onSubmit = (data: FormData) => {
    setParams(data as Partial<FormParams>)
    localStorage.setItem('params', JSON.stringify(data))
  }

  const onError = (errors: FieldErrors<FormData>) => {
    console.error('validation errors:', errors)
  }

  const handleChange = () => {
    handleSubmit(onSubmit, onError)()
  }

  const handleClear = () => {
    const { apiUrl, apiKey } = getValues()
    reset({
      ...defaultFormState,
      apiUrl,
      apiKey
    })
    handleSubmit(onSubmit, onError)()
  }

  const handleResetCluster = (currentValues: Partial<FormData>) => {
    reset({
      ...currentValues,
      // TODO: they should not be reset one-by-one with false/null values
      cluster: null,
      clusterAutoSwitch: false,
      slidingClusterPrecision: false,
      clusterLimit: null,
      clusterPrecision: null
    })
    handleSubmit(onSubmit, onError)()
  }

  const handleRestoreCluster = (currentValues: Partial<FormData>) => {
    reset({
      ...currentValues,
      // TODO: they should not be set one-by-one with custom values
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
    trigger()
  }, [])

  useEffect(() => {
    if (!clusterEnabled) {
      // TODO: double check if we ever need to set these values?
      setValue('clusterPrecision', null)
      return
    } else {
      // clusterEnabled
      if (slidingClusterPrecision) {
        const roundedZoom = Math.round(position?.zoom || 0) + 2
        // TODO: check why do we need to set both values?
        setParam('clusterPrecision', roundedZoom)
        setValue('clusterPrecision', roundedZoom)
      }
    }
  }, [position?.zoom, slidingClusterPrecision, clusterEnabled])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Stack
          spacing={1}
          alignItems="flex-start"
          justifyContent="stretch"
          height="100%"
        >
          <CredentialsSection onChange={handleChange} />
          <QueryParamsSection onChange={handleChange} onClear={handleClear} />
          <ClustersSection onChange={handleChange} />
          <BoundsSection />
        </Stack>
      </form>
    </FormProvider>
  )
}

export default ParamsForm
