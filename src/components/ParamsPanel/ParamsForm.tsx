import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { joiResolver } from '@hookform/resolvers/joi'
import { Box, Stack, Typography } from '@mui/material'

import { useSearch } from 'providers/SearchProvider'

import ParamsField from './ParamsField'
import schema from './schema'

const apiUrl = process.env.REACT_APP_REPLIERS_API_URL || ''
const apiKey = process.env.REACT_APP_REPLIERS_KEY || ''
const boardId = process.env.REACT_APP_REPLIERS_BOARD_ID || 0

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
    boardId: boardId || 0,
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
      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
        style={{ height: '100%' }}
      >
        <Stack
          spacing={1}
          alignItems="flex-start"
          justifyContent="stretch"
          height="100%"
        >
          <Typography variant="h6" fontSize="12px" textTransform="uppercase">
            credentials
          </Typography>
          <Box
            sx={{
              p: 1.25,
              width: '100%',
              boxSizing: 'border-box',
              bgcolor: 'background.default',
              overflow: 'hidden',
              border: 1,
              borderRadius: 2,
              borderColor: '#eee'
              // boxShadow: 1
            }}
          >
            <ParamsField
              noClear
              name="apiKey"
              label="REPILERS-API-KEY"
              hint="* HTTP Header"
              onChange={handleChange}
            />
          </Box>
          <Typography variant="h6" fontSize="12px" textTransform="uppercase">
            query parameters
          </Typography>
          <Box
            sx={{
              flex: 1,
              p: 1.25,
              pr: 0.25,
              width: '100%',
              display: 'flex',
              boxSizing: 'border-box',
              bgcolor: 'background.default',
              overflow: 'hidden',
              border: 1,
              borderRadius: 2,
              borderColor: '#eee'
              // boxShadow: 1
            }}
          >
            <Box
              sx={{
                pr: 1,
                flex: 1,
                width: '100%',
                overflow: 'auto',
                scrollbarWidth: 'thin'
              }}
            >
              <Stack spacing={1.25}>
                <ParamsField name="boardId" noClear onChange={handleChange} />
                <ParamsField name="class" onChange={handleChange} />
                <ParamsField name="status" onChange={handleChange} />
                <ParamsField name="lastStatus" onChange={handleChange} />
                <ParamsField name="type" onChange={handleChange} />
                <ParamsField name="propertyType" onChange={handleChange} />
                <ParamsField name="sortBy" onChange={handleChange} />

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
                  <ParamsField name="minBeds" onChange={handleChange} />
                  <ParamsField name="minBaths" onChange={handleChange} />
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </form>
    </FormProvider>
  )
}

export default ParamsForm
