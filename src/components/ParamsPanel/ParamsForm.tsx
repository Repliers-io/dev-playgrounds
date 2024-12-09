import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { joiResolver } from '@hookform/resolvers/joi'
import { Box, InputLabel, Stack, TextField } from '@mui/material'

import { useMapOptions } from 'providers/MapOptionsProvider'
import { useSearch } from 'providers/SearchProvider'

import schema from './schema'

const apiUrl = import.meta.env.VITE_REPLIERS_API_URL
const apiKey = import.meta.env.VITE_REPLIERS_KEY

type FormData = {
  apiUrl: string
  apiKey: string
}

const ParamsForm = () => {
  const { position } = useMapOptions()
  const { setFilters } = useSearch()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onBlur',
    values: {
      apiUrl: apiUrl || '',
      apiKey: apiKey || ''
    },
    resolver: joiResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    setFilters(data)
  }

  useEffect(() => {
    if (position.bounds) {
      handleSubmit(onSubmit)()
    }
  }, [position.bounds])

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing={1.25}>
        <InputLabel htmlFor="apiUrl">API URL</InputLabel>
        <TextField
          id="apiUrl"
          placeholder={apiUrl}
          {...register('apiUrl')}
          error={!!errors.apiUrl}
          helperText={errors.apiUrl?.message}
          fullWidth
          size="small"
          slotProps={{
            input: {
              readOnly: true,
              startAdornment: (
                <Box sx={{ fontSize: '12px', fontWeight: 600, pl: 0, pr: 1.5 }}>
                  GET:
                </Box>
              )
            }
          }}
        />
        <InputLabel htmlFor="apiKey">REPLIERS-API-KEY</InputLabel>
        <TextField
          id="apiKey"
          placeholder="REPLIERS-API-KEY"
          {...register('apiKey')}
          error={!!errors.apiKey}
          helperText={errors.apiKey?.message}
          fullWidth
          size="small"
          slotProps={{
            input: {
              // readOnly: true
            }
          }}
        />
      </Stack>
    </form>
  )
}

export default ParamsForm
