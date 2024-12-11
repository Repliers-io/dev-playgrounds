import React, { useEffect, useMemo } from 'react'
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
  class: string | string[]
  status: string | string[]
  lastStatus: string | string[]
  type: string | string[]
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
    mode: 'onBlur', // Validate on blur
    reValidateMode: 'onBlur', // Re-validate on blur
    shouldFocusError: false, // Do not auto-focus on errors
    defaultValues: {
      apiUrl: apiUrl || '',
      apiKey: apiKey || '',
      boardId: boardId || 0,
      class: '',
      status: '',
      lastStatus: '',
      type: ''
    },
    resolver: joiResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    console.log('setParams data', data)
    setParams(data as any)
  }

  const onError = (errors: any) => {
    console.log('validation errors:', errors)
  }
  const handleBlur = () => {
    handleSubmit(onSubmit, onError)()
  }

  // const handleKeyDown = (event: React.KeyboardEvent) => {
  //   console.log('event.key', event.key)
  //   // if (event.key === 'Enter') {
  //   // event.preventDefault() // Prevent form submission
  //   handleSubmit(onSubmit, onError)()
  //   // }
  // }

  const handlers = {
    onBlur: handleBlur,
    onFocus: handleBlur
  }

  useEffect(() => {
    handleSubmit(onSubmit, onError)()
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      <Stack spacing={1}>
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
          <Stack spacing={1.25}>
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
              {...handlers}
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
            {/* <TextField
              placeholder={apiUrl}
              {...register('apiUrl')}
              {...handlers}
              error={!!errors.apiUrl}
              helperText={errors.apiUrl?.message}
              fullWidth
              size="small"
              slotProps={{
                input: {
                  readOnly: true,
                  startAdornment: (
                    <Box
                      sx={{ fontSize: '12px', fontWeight: 600, pl: 0, pr: 1.5 }}
                    >
                      GET:
                    </Box>
                  )
                }
              }}
            /> */}
          </Stack>
        </Box>
        <Typography variant="h6" fontSize="12px" textTransform="uppercase">
          query parameters
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
          <Stack spacing={1.25}>
            <InputLabel htmlFor="boardId">boardId</InputLabel>
            <TextField
              id="boardId"
              placeholder="boardId"
              {...register('boardId')}
              {...handlers}
              fullWidth
              size="small"
            />
            <InputLabel htmlFor="class">class</InputLabel>
            <TextField
              id="class"
              placeholder="class"
              {...register('class')}
              fullWidth
              size="small"
            />
            <InputLabel htmlFor="status">status</InputLabel>
            <TextField
              id="status"
              placeholder="status"
              {...register('status')}
              {...handlers}
              fullWidth
              size="small"
            />
            <InputLabel htmlFor="lastStatus">lastStatus</InputLabel>
            <TextField
              id="lastStatus"
              placeholder="lastStatus"
              {...register('lastStatus')}
              {...handlers}
              fullWidth
              size="small"
            />
            <InputLabel htmlFor="type">type</InputLabel>
            <TextField
              id="type"
              placeholder="type"
              {...register('type')}
              {...handlers}
              fullWidth
              size="small"
            />
          </Stack>
        </Box>
      </Stack>
    </form>
  )
}

export default ParamsForm
