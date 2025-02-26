import { useEffect, useMemo } from 'react'
import merge from 'deepmerge'
import queryString from 'query-string'
import { type FieldErrors, FormProvider, useForm } from 'react-hook-form'

import { joiResolver } from '@hookform/resolvers/joi'
import { Stack } from '@mui/material'

import { type FormParams, useSearch } from 'providers/SearchProvider'

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

const multiSelectFields = [
  'type',
  'class',
  'style',
  'status',
  'lastStatus',
  'propertyType'
] as const

const ParamsForm = () => {
  const { setParams, params: localStorageParams } = useSearch()

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

  const { handleSubmit, trigger, reset, getValues } = methods

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

  useEffect(() => {
    trigger()
  }, [])

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Stack spacing={1}>
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
