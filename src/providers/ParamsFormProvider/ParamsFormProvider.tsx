import React, { createContext, useContext, useEffect, useMemo } from 'react'
import merge from 'deepmerge'
import queryString from 'query-string'
import { type FieldErrors, FormProvider, useForm } from 'react-hook-form'

import { joiResolver } from '@hookform/resolvers/joi'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { type FormParams, useSearch } from 'providers/SearchProvider'

import defaultFormState from './defaults'
import schema from './schema'
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

const booleanFields = [
  'dynamicClustering',
  'dynamicClusterPrecision',
  'stats'
] as const

type ParamsFormContextType = {
  onChange: () => void
  onClear: () => void
}

export const ParamsFormContext = createContext<
  ParamsFormContextType | undefined
>(undefined)

const ParamsFormProvider = ({ children }: { children: React.ReactNode }) => {
  const { params: localStorageParams, setParams } = useSearch()

  //  TODO: form should not have access to window.location.search and do any params parsing
  // cache them one time on first render
  const params = useMemo(() => {
    const parsed = queryString.parse(window.location.search)
    const formatted = formatBooleanFields(parsed, booleanFields)
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
  const { trigger, handleSubmit, reset, getValues } = methods

  const onSubmit = (data: FormData) => {
    setParams(data as Partial<FormParams>)
  }

  const onError = (errors: FieldErrors<FormData>) => {
    console.error('validation errors:', errors)
  }

  const onChange = () => {
    handleSubmit(onSubmit, onError)()
  }

  const onClear = () => {
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

  const contextValue = useMemo(
    () => ({
      onChange,
      onClear
    }),
    []
  )

  return (
    <FormProvider {...methods}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ParamsFormContext.Provider value={contextValue}>
          <form noValidate onSubmit={handleSubmit(onSubmit, onError)}>
            {children}
          </form>
        </ParamsFormContext.Provider>
      </LocalizationProvider>
    </FormProvider>
  )
}

export const useParamsForm = () => {
  const context = useContext(ParamsFormContext)
  if (context === undefined) {
    throw new Error('useParamsForm must be used within an ParamsFormProvider')
  }
  return context
}

export default ParamsFormProvider
