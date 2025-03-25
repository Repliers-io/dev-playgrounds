import React, { createContext, useContext, useEffect, useMemo } from 'react'
import merge from 'deepmerge'
import { type FieldErrors, FormProvider, useForm } from 'react-hook-form'

import { joiResolver } from '@hookform/resolvers/joi'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { type FormParams, useSearch } from 'providers/SearchProvider'

import defaultFormState from './defaults'
import schema from './schema'
import { type FormData } from './types'

type ParamsFormContextType = {
  onChange: () => void
  onClear: () => void
}

export const ParamsFormContext = createContext<
  ParamsFormContextType | undefined
>(undefined)

const ParamsFormProvider = ({ children }: { children: React.ReactNode }) => {
  const { params, setParams } = useSearch()
  const defaultValues = merge(defaultFormState, params)

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
          {children}
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
