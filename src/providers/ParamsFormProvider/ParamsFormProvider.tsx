import React, { createContext, useContext, useEffect, useMemo } from 'react'
import merge from 'deepmerge'
import { type FieldErrors, FormProvider, useForm } from 'react-hook-form'

import { joiResolver } from '@hookform/resolvers/joi'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { type FormParams } from 'providers/ParamsFormProvider'
import { useSearch } from 'providers/SearchProvider'

import defaultFormState from './defaults'
import schema from './schema'

type ParamsFormContextType = {
  onChange: () => void
  onClear: () => void
}

export const ParamsFormContext = createContext<
  ParamsFormContextType | undefined
>(undefined)

const ParamsFormProvider = ({ children }: { children: React.ReactNode }) => {
  const { params, setParams } = useSearch()

  const initialValues = useMemo(() => merge(defaultFormState, params), [params])

  // Create form with clean defaults
  const methods = useForm<FormParams>({
    defaultValues: defaultFormState,
    values: initialValues,
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur', // Re-validate on blur
    shouldFocusError: false, // Do not auto-focus on errors
    resolver: joiResolver(schema, { allowUnknown: true })
  })
  const { trigger, handleSubmit, reset, getValues, setValue } = methods

  const onSubmit = (data: FormParams) => {
    setParams(data as Partial<FormParams>)
  }

  const onError = (errors: FieldErrors<FormParams>) => {
    console.error('validation errors:', errors)
  }

  const onChange = () => {
    handleSubmit(onSubmit, onError)()
  }

  const onClear = () => {
    const { apiUrl, apiKey, tab } = getValues()
    reset({
      ...defaultFormState,
      apiUrl,
      apiKey,
      tab: tab || 'map'
    })
    // After reset, ensure imageSearchItems has at least one default item
    setValue('imageSearchItems', [
      { id: crypto.randomUUID(), type: 'text', value: '', boost: 1 }
    ])
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
