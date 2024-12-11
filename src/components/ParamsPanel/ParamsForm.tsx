import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { joiResolver } from '@hookform/resolvers/joi'
import { Box, InputLabel, Stack, TextField, Typography } from '@mui/material'

import { useSearch } from 'providers/SearchProvider'

import schema from './schema'

const apiUrl = import.meta.env.VITE_REPLIERS_API_URL
const apiKey = import.meta.env.VITE_REPLIERS_KEY
const boardId = import.meta.env.VITE_REPLIERS_BOARD_ID

type FormData = {
  apiUrl: string
  apiKey: string
  boardId: number
  // class: string | string[]
  // status: string | string[]
  // lastStatus: string | string[]
  // type: string | string[]
  // minPrice: number | null
  // maxPrice: number | null
  // minSoldPrice?: number | null
  // maxSoldPrice?: number | null
}

const ParamsForm = () => {
  const { setParams } = useSearch()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    mode: 'onBlur',
    values: {
      apiUrl: apiUrl || '',
      apiKey: apiKey || '',
      boardId: boardId || 0
      // class: ''
      // status: '',
      // lastStatus: '',
      // type: '',
      // minPrice: 0,
      // maxPrice: 0,
      // minSoldPrice: 0,
      // maxSoldPrice: 0
    },
    resolver: joiResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    setParams(data as any)
  }

  useEffect(() => {
    handleSubmit(onSubmit)()
  }, [])

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
        <Stack spacing={2} direction="row" justifyContent="space-between">
          <InputLabel htmlFor="apiKey">REPLIERS-API-KEY</InputLabel>
          <Typography variant="body2" color="text.hint">
            * passed as HTTP Header
          </Typography>
        </Stack>
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
        <InputLabel htmlFor="boardId">boardId</InputLabel>
        <TextField
          id="boardId"
          placeholder="boardId"
          {...register('boardId')}
          fullWidth
          size="small"
        />
        {/* <InputLabel htmlFor="class">class</InputLabel>
        <TextField
          id="class"
          placeholder="class"
          {...register('class')}
          fullWidth
          size="small"
        /> */}
        {/* <InputLabel htmlFor="status">status</InputLabel>
        <TextField
          id="status"
          placeholder="status"
          {...register('status')}
          fullWidth
          size="small"
        />
        <InputLabel htmlFor="lastStatus">lastStatus</InputLabel>
        <TextField
          id="lastStatus"
          placeholder="lastStatus"
          {...register('lastStatus')}
          fullWidth
          size="small"
        />
        <InputLabel htmlFor="type">type</InputLabel>
        <TextField
          id="type"
          placeholder="type"
          {...register('type')}
          fullWidth
          size="small"
        /> */}
      </Stack>
    </form>
  )
}

export default ParamsForm
