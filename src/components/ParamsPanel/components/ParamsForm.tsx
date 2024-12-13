import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { joiResolver } from '@hookform/resolvers/joi'
import { Box, Stack } from '@mui/material'

import { useSearch } from 'providers/SearchProvider'

import schema from '../schema'

import ParamsField from './ParamsField'
import ParamsSection from './ParamsSection'
import ParamsSelect from './ParamsSelect'

const apiUrl = process.env.REACT_APP_REPLIERS_API_URL || ''
const apiKey = process.env.REACT_APP_REPLIERS_KEY || ''

const classOptions = ['condo', 'residential', 'commercial']
const typeOptions = ['sale', 'lease']
const statusOptions = ['a', 'u']

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
  // minPrice: number | null
  // maxPrice: number | null
  // minSoldPrice?: number | null
  // maxSoldPrice?: number | null
}

const ParamsForm = () => {
  const { setParams } = useSearch()
  const defaultValues = JSON.parse(
    localStorage.getItem('params') || 'false'
  ) || {
    apiKey: apiKey || '',
    apiUrl: apiUrl || '',
    boardId: null,
    class: '',
    status: '',
    lastStatus: '',
    type: '',
    propertyType: '',
    sortBy: '',
    minPrice: null,
    maxPrice: null
  }
  const methods = useForm<FormData>({
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur', // Re-validate on blur
    shouldFocusError: false, // Do not auto-focus on errors
    defaultValues,
    resolver: joiResolver(schema, { allowUnknown: true })
  })
  const { handleSubmit } = methods

  const onSubmit = (data: FormData) => {
    localStorage.setItem('params', JSON.stringify(data))
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
            <ParamsField
              noClear
              name="apiKey"
              label="REPILERS-API-KEY"
              hint="* HTTP Header"
              onChange={handleChange}
            />
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
                  <ParamsField name="pageNum" onChange={handleChange} />
                  <ParamsField name="resultsPerPage" onChange={handleChange} />
                </Stack>
                <ParamsField name="sortBy" onChange={handleChange} />
                <ParamsSelect
                  name="class"
                  options={classOptions}
                  onChange={handleChange}
                />
                <ParamsSelect
                  name="status"
                  options={statusOptions}
                  onChange={handleChange}
                />
                <ParamsField name="lastStatus" onChange={handleChange} />
                <ParamsSelect
                  name="type"
                  hint="type field hint"
                  link="https://example.com"
                  options={typeOptions}
                  onChange={handleChange}
                />
                <ParamsField name="propertyType" onChange={handleChange} />

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
