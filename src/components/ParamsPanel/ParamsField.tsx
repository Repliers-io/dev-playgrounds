import React, { useRef } from 'react'
import { useFormContext } from 'react-hook-form'

import ClearIcon from '@mui/icons-material/Clear'
import {
  Box,
  IconButton,
  InputAdornment,
  InputLabel,
  Stack,
  TextField,
  Typography
} from '@mui/material'

const ParamsField = ({
  name,
  label,
  hint,
  link,
  type = 'text',
  noClear = false,
  onChange
}: {
  name: string
  label?: string
  hint?: string
  link?: string
  type?: string
  noClear?: boolean
  onChange?: () => void
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const {
    trigger,
    register,
    setValue,
    getValues,
    formState: { errors }
  } = useFormContext()
  const value = getValues(name)

  const handleFocus = () => {
    trigger(name)
    onChange?.()
  }
  // eslint-disable-next-line no-param-reassign
  if (!label) label = name

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault() // Prevent form submission
      onChange?.()
    }
  }

  const handleClearClick = () => {
    setValue(name, '')
    inputRef.current?.focus()
    onChange?.()
  }

  return (
    <Box flex={1}>
      <Stack spacing={2} direction="row" pb={1}>
        <InputLabel htmlFor={name}>{label}</InputLabel>
        {(hint || link) && (
          <Typography variant="body2" color="text.hint">
            {link ? (
              <a target="_blank" href={link}>
                {hint} <b>↗</b>
              </a>
            ) : (
              hint
            )}
          </Typography>
        )}
      </Stack>
      <TextField
        id={name}
        inputRef={inputRef}
        fullWidth
        type={type}
        size="small"
        placeholder={label}
        error={!!errors[name]}
        helperText={errors[name]?.message?.toString()}
        {...register(name)}
        onBlur={handleFocus}
        onKeyDown={handleKeyDown}
        slotProps={{
          input: {
            endAdornment: Boolean(!noClear && value?.length) && (
              <InputAdornment position="end" sx={{ pr: 0.75 }}>
                <IconButton
                  tabIndex={-1}
                  onClick={handleClearClick}
                  edge="end"
                  size="small"
                >
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            )
          }
        }}
      />
    </Box>
  )
}

export default ParamsField
